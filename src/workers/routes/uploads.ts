import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { Env, ApiResponse, ImageListQuery } from '../../types';
import { ImageStorageService } from '../models/image-storage';

export const uploadsRouter = new Hono<{ Bindings: Env }>();

// 圖片上傳
uploadsRouter.post('/image', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const tagsStr = formData.get('tags') as string;
    const sourceMedia = formData.get('source_media') as string;
    const categoryStr = formData.get('category') as string;
    
    if (!file) {
      return c.json<ApiResponse>({
        success: false,
        message: 'No file provided',
        data: null,
      }, 400);
    }

    // 檢查文件類型
    if (!ImageStorageService.isValidImageType(file.type)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.',
        data: null,
      }, 400);
    }

    // 檢查文件大小 (10MB 限制)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json<ApiResponse>({
        success: false,
        message: `File too large. Maximum size is ${ImageStorageService.formatFileSize(maxSize)}.`,
        data: null,
      }, 400);
    }

    const userId = c.req.header('x-user-id') || 'anonymous';
    const tags = tagsStr ? JSON.parse(tagsStr) : [];
    const category = categoryStr ? parseInt(categoryStr) as 1 | 2 | 3 : 3;
    
    // 驗證分類值
    if (category < 1 || category > 3) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid category. Must be 1 (首頁圖), 2 (風格圖), or 3 (其他).',
        data: null,
      }, 400);
    }

    // Category 1 (首頁圖) 只能有一張圖片的約束檢查
    if (category === 1) {
      const tempImageStorage = new ImageStorageService(c.env);
      const existingCategory1 = await tempImageStorage.getImages({ category: 1, limit: 1 });
      
      if (existingCategory1.images.length > 0) {
        return c.json<ApiResponse>({
          success: false,
          message: 'Category 1 (首頁圖) can only have one image. Please remove the existing image first or choose a different category.',
          data: null,
        }, 400);
      }
    }
    
    const imageStorage = new ImageStorageService(c.env);
    const imageRecord = await imageStorage.uploadImage(
      file, 
      userId, 
      description || undefined, 
      tags,
      sourceMedia || undefined,
      category
    );

    return c.json<ApiResponse>({
      success: true,
      message: 'Image uploaded successfully',
      data: imageRecord,
    }, 201);

  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json<ApiResponse>({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload image',
      data: null,
    }, 500);
  }
});

// 測試數據庫連接
uploadsRouter.get('/test-db', async (c) => {
  try {
    const result = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM images`).first();
    return c.json<ApiResponse>({
      success: true,
      message: 'Database connection test successful',
      data: result,
    });
  } catch (error) {
    console.error('Database test error:', error);
    return c.json<ApiResponse>({
      success: false,
      message: `Database test failed: ${error instanceof Error ? error.message : String(error)}`,
      data: null,
    }, 500);
  }
});

// 獲取圖片列表
uploadsRouter.get('/images', async (c) => {
  try {
    console.log('Starting image fetch...');
    
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
    const category = c.req.query('category') ? parseInt(c.req.query('category')!) : undefined;
    
    console.log(`Fetching images with page=${page}, limit=${limit}, category=${category}`);

    const imageStorage = new ImageStorageService(c.env);
    const result = await imageStorage.getImages({
      page,
      limit,
      category: category as 1 | 2 | 3 | undefined,
    });

    console.log(`Found ${result.images.length} images`);

    const totalPages = Math.ceil(result.total / limit);

    return c.json<ApiResponse>({
      success: true,
      message: 'Images retrieved successfully',
      data: result.images,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    return c.json<ApiResponse>({
      success: false,
      message: `Failed to fetch images: ${error instanceof Error ? error.message : String(error)}`,
      data: null,
    }, 500);
  }
});

// 獲取單張圖片信息
uploadsRouter.get('/image/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid image ID',
        data: null,
      }, 400);
    }

    const imageStorage = new ImageStorageService(c.env);
    const image = await imageStorage.getImageById(id);

    if (!image) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Image not found',
        data: null,
      }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      message: 'Image retrieved successfully',
      data: image,
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch image',
      data: null,
    }, 500);
  }
});

// 下載圖片文件
uploadsRouter.get('/image/:id/download', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return new Response('Invalid image ID', { status: 400 });
    }

    const imageStorage = new ImageStorageService(c.env);
    const image = await imageStorage.getImageById(id);

    if (!image) {
      return new Response('Image not found', { status: 404 });
    }

    const r2Object = await imageStorage.getImageFromR2(image.r2_key);
    if (!r2Object) {
      return new Response('Image file not found in storage', { status: 404 });
    }

    return new Response(r2Object.body, {
      headers: {
        'Content-Type': image.mime_type,
        'Content-Disposition': `inline; filename="${image.original_filename}"`,
        'Content-Length': image.file_size.toString(),
        'Cache-Control': 'public, max-age=31536000', // 1年緩存
        'ETag': `"${image.id}-${image.upload_time}"`,
      },
    });

  } catch (error) {
    console.error('Error downloading image:', error);
    return new Response('Failed to download image', { status: 500 });
  }
});

// 更新圖片信息
uploadsRouter.put('/image/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid image ID',
        data: null,
      }, 400);
    }

    const body = await c.req.json();
    const { description, tags, source_media, category } = body;
    
      // 驗證分類值（如果提供）
  if (category !== undefined && (category < 1 || category > 3)) {
    return c.json<ApiResponse>({
      success: false,
      message: 'Invalid category. Must be 1 (首頁圖), 2 (風格圖), or 3 (其他).',
      data: null,
    }, 400);
  }

  // Category 1 (首頁圖) 只能有一張圖片的約束檢查
  if (category === 1) {
    const imageStorage = new ImageStorageService(c.env);
    const existingCategory1 = await imageStorage.getImages({ category: 1, limit: 1 });
    
    if (existingCategory1.images.length > 0) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Category 1 (首頁圖) can only have one image. Please remove the existing image first or choose a different category.',
        data: null,
      }, 400);
    }
  }

    const imageStorage = new ImageStorageService(c.env);
    const updatedImage = await imageStorage.updateImage(id, {
      description,
      tags,
      source_media,
      category,
    });

    if (!updatedImage) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Image not found',
        data: null,
      }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      message: 'Image updated successfully',
      data: updatedImage,
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to update image',
      data: null,
    }, 500);
  }
});

// 刪除圖片
uploadsRouter.delete('/image/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid image ID',
        data: null,
      }, 400);
    }

    const imageStorage = new ImageStorageService(c.env);
    const deleted = await imageStorage.deleteImage(id);

    if (!deleted) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Image not found or already deleted',
        data: null,
      }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      message: 'Image deleted successfully',
      data: null,
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to delete image',
      data: null,
    }, 500);
  }
});

// 批量刪除圖片
uploadsRouter.delete('/images', async (c) => {
  try {
    const body = await c.req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid or empty image IDs array',
        data: null,
      }, 400);
    }

    const imageStorage = new ImageStorageService(c.env);
    const result = await imageStorage.deleteImages(ids);

    return c.json<ApiResponse>({
      success: true,
      message: `Batch delete completed: ${result.deleted} deleted, ${result.failed} failed`,
      data: result,
    });

  } catch (error) {
    console.error('Error batch deleting images:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to batch delete images',
      data: null,
    }, 500);
  }
});

// 獲取圖片統計數據
uploadsRouter.get('/stats', async (c) => {
  try {
    const userId = c.req.query('user_id');
    
    const imageStorage = new ImageStorageService(c.env);
    const stats = await imageStorage.getImageStats(userId || undefined);

    return c.json<ApiResponse>({
      success: true,
      message: 'Image statistics retrieved successfully',
      data: stats,
    });

  } catch (error) {
    console.error('Error fetching image stats:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch image statistics',
      data: null,
    }, 500);
  }
});

// 文件上傳 (舊的截圖上傳，保持向後兼容)
uploadsRouter.post('/screenshot', async (c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'Please use /image endpoint for image uploads',
    data: null,
  }, 410); // Gone
});

// 獲取腳本截圖 (舊的接口，保持向後兼容)
uploadsRouter.get('/script/:scriptId/screenshots', async (c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'Please use /images endpoint with appropriate filters',
    data: null,
  }, 410); // Gone
});


