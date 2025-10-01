import {
  ApiResponse,
  ScriptCategory,
  ScriptTemplate,
  ScriptRating,
  ScriptListQuery,
  CreateScriptTemplateRequest,
  UpdateScriptTemplateRequest,
  CreateScriptRatingRequest,
  ImageRecord,
  ImageListQuery,
  ImageStats,
} from '../types';

class ApiClient {
  private baseUrl: string;
  private userId: string;

  constructor(baseUrl = '/api', userId = 'anonymous') {
    this.baseUrl = baseUrl;
    this.userId = userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': this.userId,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // 腳本分類相關
  async getCategories(): Promise<ScriptCategory[]> {
    const response = await this.request<ScriptCategory[]>('/scripts/categories');
    return response.data || [];
  }

  // 腳本相關
  async getScripts(query: ScriptListQuery = {}): Promise<{
    scripts: ScriptTemplate[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<ScriptTemplate[]>(
      `/scripts?${searchParams.toString()}`
    );
    
    return {
      scripts: response.data || [],
      pagination: response.pagination,
    };
  }

  async getScript(id: number): Promise<ScriptTemplate | null> {
    try {
      const response = await this.request<ScriptTemplate>(`/scripts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch script:', error);
      return null;
    }
  }

  async createScript(data: CreateScriptTemplateRequest): Promise<ScriptTemplate | null> {
    try {
      const response = await this.request<ScriptTemplate>('/scripts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create script:', error);
      return null;
    }
  }

  async updateScript(id: number, data: Partial<UpdateScriptTemplateRequest>): Promise<ScriptTemplate | null> {
    try {
      const response = await this.request<ScriptTemplate>(`/scripts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update script:', error);
      return null;
    }
  }

  async deleteScript(id: number): Promise<boolean> {
    try {
      await this.request(`/scripts/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete script:', error);
      return false;
    }
  }

  async recordScriptCopy(scriptId: number): Promise<void> {
    try {
      await this.request(`/scripts/${scriptId}/copy`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to record script copy:', error);
    }
  }

  // 評分相關
  async createRating(data: CreateScriptRatingRequest): Promise<ScriptRating | null> {
    try {
      const response = await this.request<ScriptRating>('/ratings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create rating:', error);
      return null;
    }
  }

  async getScriptRatings(scriptId: number, page = 1, limit = 10): Promise<{
    ratings: ScriptRating[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await this.request<ScriptRating[]>(
        `/ratings/script/${scriptId}?page=${page}&limit=${limit}`
      );
      return {
        ratings: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
      return { ratings: [] };
    }
  }

  // 設置用戶 ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // 設置 API 基礎 URL
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  // 圖片相關方法

  /**
   * 上傳圖片
   */
  async uploadImage(
    file: File,
    description?: string,
    tags?: string[],
    sourceMedia?: string,
    category?: 1 | 2 | 3
  ): Promise<ImageRecord> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (description) {
      formData.append('description', description);
    }
    
    if (tags && tags.length > 0) {
      formData.append('tags', JSON.stringify(tags));
    }
    
    if (sourceMedia) {
      formData.append('source_media', sourceMedia);
    }
    
    if (category) {
      formData.append('category', category.toString());
    }

    const response = await fetch(`${this.baseUrl}/uploads/image`, {
      method: 'POST',
      headers: {
        'x-user-id': this.userId,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.data;
  }

  /**
   * 獲取圖片列表
   */
  async getImages(query: ImageListQuery = {}): Promise<{
    images: ImageRecord[];
    total: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (query.page) searchParams.set('page', query.page.toString());
    if (query.limit) searchParams.set('limit', query.limit.toString());
    if (query.user_id) searchParams.set('user_id', query.user_id);
    if (query.source_media) searchParams.set('source_media', query.source_media);
    if (query.sort_by) searchParams.set('sort_by', query.sort_by);
    if (query.sort_order) searchParams.set('sort_order', query.sort_order);
    if (query.category) searchParams.set('category', query.category.toString());
    if (query.tags && query.tags.length > 0) {
      searchParams.set('tags', query.tags.join(','));
    }

    const response = await this.request<ImageRecord[]>(`/uploads/images?${searchParams.toString()}`);
    
    return {
      images: response.data || [],
      total: response.pagination?.total || 0,
      pagination: response.pagination,
    };
  }

  /**
   * 獲取單張圖片信息
   */
  async getImage(id: number): Promise<ImageRecord> {
    const response = await this.request<ImageRecord>(`/uploads/image/${id}`);
    if (!response.data) {
      throw new Error('Image not found');
    }
    return response.data;
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
  ): Promise<ImageRecord> {
    const response = await this.request<ImageRecord>(`/uploads/image/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response.data) {
      throw new Error('Failed to update image');
    }
    
    return response.data;
  }

  /**
   * 刪除圖片
   */
  async deleteImage(id: number): Promise<void> {
    await this.request(`/uploads/image/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 批量刪除圖片
   */
  async deleteImages(ids: number[]): Promise<{ deleted: number; failed: number }> {
    const response = await this.request<{ deleted: number; failed: number }>('/uploads/images', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    
    return response.data || { deleted: 0, failed: ids.length };
  }

  /**
   * 獲取圖片統計數據
   */
  async getImageStats(userId?: string): Promise<ImageStats> {
    const searchParams = new URLSearchParams();
    if (userId) searchParams.set('user_id', userId);
    
    const response = await this.request<ImageStats>(`/uploads/stats?${searchParams.toString()}`);
    return response.data || {
      total_images: 0,
      total_size: 0,
      images_by_type: [],
      recent_uploads: [],
    };
  }

  /**
   * 獲取圖片下載 URL
   */
  getImageDownloadUrl(id: number): string {
    return `${this.baseUrl}/uploads/image/${id}/download`;
  }

  /**
   * 下載圖片 (返回 Blob)
   */
  async downloadImage(id: number): Promise<Blob> {
    const response = await fetch(this.getImageDownloadUrl(id), {
      headers: {
        'x-user-id': this.userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    return response.blob();
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

  /**
   * 輔助方法：驗證圖片文件類型
   */
  static isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(file.type.toLowerCase());
  }

  /**
   * 輔助方法：驗證文件大小
   */
  static isValidFileSize(file: File, maxSizeMB = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}

// 創建默認實例，指向 Cloudflare Workers API
export const apiClient = new ApiClient('http://localhost:8787/api');

// 導出類以便創建自定義實例
export { ApiClient };
