import { Env, ImageRecord, ImageListQuery, ImageStats } from '../../types';

/**
 * 圖片存儲服務類
 * 處理圖片上傳、存儲、查詢和管理功能
 */
export class ImageStorageService {
  private db: D1Database;
  private bucket: R2Bucket;

  constructor(env: Env) {
    this.db = env.DB;
    this.bucket = env.BUCKET;
  }

  /**
   * 上傳圖片到 R2 並記錄到 D1
   */
  async uploadImage(
    file: File, 
    userId = 'anonymous', 
    description?: string, 
    tags: string[] = [],
    sourceMedia?: string,
    category: 1 | 2 | 3 = 3
  ): Promise<ImageRecord> {
    try {
      // 生成唯一的文件名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const extension = this.getFileExtension(file.name) || 'jpg';
      const filename = `${timestamp}_${randomStr}.${extension}`;
      const r2Key = `images/${filename}`;

          // 上傳到 R2 (如果可用，否則跳過)
    let uploadResult = null;
    if (this.bucket) {
      try {
        uploadResult = await this.bucket.put(r2Key, file.stream(), {
          httpMetadata: {
            contentType: file.type,
            contentDisposition: `inline; filename="${file.name}"`
          },
          customMetadata: {
            originalFilename: file.name,
            uploadedBy: userId,
            uploadTime: new Date().toISOString(),
          }
        });
      } catch (error) {
        console.error('R2 upload failed:', error instanceof Error ? error.message : String(error));
        console.error('R2 upload error details:', error);
        // 即使 R2 上傳失敗，我們仍然保存數據庫記錄
        // 但要記錄這個事實
        console.warn('Continuing with database record only due to R2 failure');
      }
    } else {
      console.warn('R2 bucket not configured, saving metadata only');
    }

      // 記錄到 D1
      console.log('Attempting database insert for file:', filename);
      const result = await this.db.prepare(`
        INSERT INTO images (
          filename, original_filename, r2_key, file_size, mime_type,
          user_id, description, tags, source_media, category, folder_name, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `).bind(
        filename,
        file.name,
        r2Key,
        file.size,
        file.type,
        userId,
        description || null,
        JSON.stringify(tags),
        sourceMedia || null,
        category,
        'default', // 默認資料夾
        0 // 默認排序
      ).first();

      console.log('Database insert result:', result ? 'Success' : 'Failed');

      if (!result) {
        console.error('Database insert returned null/undefined');
        // 如果數據庫插入失敗，清理 R2 中的文件（如果存在的話）
        try {
          if (this.bucket) {
            await this.bucket.delete(r2Key);
            console.log('Cleaned up R2 file after database failure');
          }
        } catch (cleanupError) {
          console.warn('Failed to cleanup R2 file:', cleanupError);
        }
        throw new Error('Failed to save image record to database');
      }

      const imageRecord = result as any;
      console.log('Successfully inserted image with ID:', imageRecord.id);
      return {
        ...imageRecord,
        tags: JSON.parse(imageRecord.tags || '[]')
      };

    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }

  /**
   * 獲取圖片列表
   */
  async getImages(query: ImageListQuery = {}): Promise<{
    images: ImageRecord[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 20,
      user_id,
      tags,
      source_media,
      category,
      sort_by = 'upload_time',
      sort_order = 'desc'
    } = query;

    const offset = (page - 1) * limit;
    
    // 構建 WHERE 條件
    const whereConditions: string[] = [];
    const params: any[] = [];
    
    if (user_id) {
      whereConditions.push('user_id = ?');
      params.push(user_id);
    }
    
    if (source_media) {
      whereConditions.push('source_media = ?');
      params.push(source_media);
    }
    
    if (category) {
      whereConditions.push('category = ?');
      params.push(category);
    }

    // 標籤搜索 (簡化版，實際項目中可能需要更複雜的 JSON 查詢)
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(() => 'tags LIKE ?').join(' OR ');
      whereConditions.push(`(${tagConditions})`);
      tags.forEach((tag: string) => params.push(`%"${tag}"%`));
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 獲取圖片列表
    const imagesQuery = `
      SELECT * FROM images 
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    
    params.push(limit, offset);
    
    const { results } = await this.db.prepare(imagesQuery)
      .bind(...params)
      .all();

    // 獲取總數
    const countQuery = `SELECT COUNT(*) as total FROM images ${whereClause}`;
    const countParams = params.slice(0, -2); // 移除 limit 和 offset
    const countResult = await this.db.prepare(countQuery)
      .bind(...countParams)
      .first();

    const images = results.map((img: any) => {
      let tags: string[] = [];
      try {
        tags = JSON.parse(img.tags || '[]');
      } catch (e) {
        console.error('Error parsing tags for image', img.id, ':', e);
        tags = [];
      }
      return {
        ...img,
        tags
      };
    }) as ImageRecord[];

    return {
      images,
      total: (countResult as any)?.total || 0,
    };
  }

  /**
   * 獲取單張圖片信息
   */
  async getImageById(id: number): Promise<ImageRecord | null> {
    const result = await this.db.prepare(`
      SELECT * FROM images WHERE id = ?
    `).bind(id).first();

    if (!result) return null;

    const imageRecord = result as any;
    let tags: string[] = [];
    try {
      tags = JSON.parse(imageRecord.tags || '[]');
    } catch (e) {
      console.error('Error parsing tags for image', imageRecord.id, ':', e);
      tags = [];
    }
    return {
      ...imageRecord,
      tags
    };
  }

  /**
   * 從 R2 獲取圖片對象
   */
  async getImageFromR2(r2Key: string): Promise<R2Object | null> {
    try {
      return await this.bucket.get(r2Key);
    } catch (error) {
      console.error('Error getting image from R2:', error);
      return null;
    }
  }

  /**
   * 更新圖片信息
   */
  async updateImage(
    id: number, 
    updates: {
      description?: string;
      tags?: string[];
      source_media?: string;
      category?: 1 | 2 | 3;
    }
  ): Promise<ImageRecord | null> {
    const updateFields: string[] = [];
    const params: any[] = [];

    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      params.push(updates.description);
    }

    if (updates.tags !== undefined) {
      updateFields.push('tags = ?');
      params.push(JSON.stringify(updates.tags));
    }

    if (updates.source_media !== undefined) {
      updateFields.push('source_media = ?');
      params.push(updates.source_media);
    }

    if (updates.category !== undefined) {
      updateFields.push('category = ?');
      params.push(updates.category);
    }

    if (updateFields.length === 0) {
      return this.getImageById(id);
    }

    params.push(id);

    const result = await this.db.prepare(`
      UPDATE images 
      SET ${updateFields.join(', ')}
      WHERE id = ?
      RETURNING *
    `).bind(...params).first();

    if (!result) return null;

    const imageRecord = result as any;
    return {
      ...imageRecord,
      tags: JSON.parse(imageRecord.tags || '[]')
    };
  }

  /**
   * 刪除圖片
   */
  async deleteImage(id: number): Promise<boolean> {
    try {
      // 直接嘗試從 D1 刪除記錄
      const result = await this.db.prepare(`
        DELETE FROM images WHERE id = ?
      `).bind(id).run();

      return (result.changes || 0) > 0;

    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * 獲取圖片統計數據
   */
  async getImageStats(userId?: string): Promise<ImageStats> {
    try {
      const userFilter = userId ? 'WHERE user_id = ?' : '';
      const userParams = userId ? [userId] : [];

      // 獲取基本統計
      const totalResult = await this.db.prepare(`
        SELECT 
          COUNT(*) as total_images,
          SUM(file_size) as total_size
        FROM images ${userFilter}
      `).bind(...userParams).first() as any;

      // 獲取按文件類型分組的統計
      const typeStatsResults = await this.db.prepare(`
        SELECT 
          mime_type,
          COUNT(*) as count,
          SUM(file_size) as total_size
        FROM images ${userFilter}
        GROUP BY mime_type
        ORDER BY count DESC
      `).bind(...userParams).all();

      // 獲取最近上傳的圖片
      const recentUploadsResults = await this.db.prepare(`
        SELECT * FROM images ${userFilter}
        ORDER BY upload_time DESC
        LIMIT 10
      `).bind(...userParams).all();

      const recentUploads = recentUploadsResults.results.map((img: any) => ({
        ...img,
        tags: JSON.parse(img.tags || '[]')
      })) as ImageRecord[];

      return {
        total_images: totalResult?.total_images || 0,
        total_size: totalResult?.total_size || 0,
        images_by_type: typeStatsResults.results as any[],
        recent_uploads: recentUploads,
      };

    } catch (error) {
      console.error('Error getting image stats:', error);
      return {
        total_images: 0,
        total_size: 0,
        images_by_type: [],
        recent_uploads: [],
      };
    }
  }

  /**
   * 批量刪除圖片
   */
  async deleteImages(ids: number[]): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        const success = await this.deleteImage(id);
        if (success) {
          deleted++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Error deleting image ${id}:`, error);
        failed++;
      }
    }

    return { deleted, failed };
  }

  /**
   * 輔助方法：獲取文件擴展名
   */
  private getFileExtension(filename: string): string | null {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : null;
  }

  /**
   * 輔助方法：驗證文件類型
   */
  static isValidImageType(mimeType: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(mimeType.toLowerCase());
  }

  /**
   * 輔助方法：格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
