import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env, ApiResponse } from '../../types';

export const promptsRouter = new Hono<{ Bindings: Env }>();

// Prompt 查詢參數驗證
const PromptQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  category: z.string().optional(),
  sort: z.enum(['popular', 'recent', 'most_used']).optional().default('popular'),
  user_id: z.string().optional(),
});

// Prompt 創建驗證
const CreatePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  description: z.string().optional(),
  category: z.string().optional().default('style_transfer'),
  image_id: z.number().optional(),
});

// Prompt 資料介面
interface PromptGalleryItem {
  id: number;
  prompt: string;
  description: string | null;
  image_id: number | null;
  image_url: string | null;
  category: string;
  favorite_count: number;
  use_count: number;
  user_id: string;
  is_favorited: boolean;
  created_at: string;
}

// 獲取 Prompts 列表
promptsRouter.get('/', zValidator('query', PromptQuerySchema), async (c) => {
  try {
    const { page, limit, category, sort, user_id } = c.req.valid('query');
    const currentUserId = c.req.header('x-user-id') || 'anonymous';

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    // 構建排序子句
    let orderBy = 'favorite_count DESC';
    if (sort === 'recent') {
      orderBy = 'created_at DESC';
    } else if (sort === 'most_used') {
      orderBy = 'use_count DESC';
    }

    // 構建查詢條件
    let whereClause = '1=1';
    const params: any[] = [];

    if (category) {
      whereClause += ' AND pg.category = ?';
      params.push(category);
    }

    if (user_id) {
      whereClause += ' AND pg.user_id = ?';
      params.push(user_id);
    }

    // 查詢 prompts（帶圖片和收藏狀態）
    const query = `
      SELECT
        pg.*,
        i.r2_key,
        CASE WHEN pf.prompt_id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
      FROM prompt_gallery pg
      LEFT JOIN images i ON pg.image_id = i.id
      LEFT JOIN prompt_favorites pf ON pg.id = pf.prompt_id AND pf.user_id = ?
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const result = await c.env.DB.prepare(query)
      .bind(currentUserId, ...params, limitNum, offset)
      .all();

    // 獲取總數
    const countQuery = `SELECT COUNT(*) as total FROM prompt_gallery pg WHERE ${whereClause}`;
    const countResult = await c.env.DB.prepare(countQuery)
      .bind(...params)
      .first<{ total: number }>();

    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    // 格式化結果，添加圖片 URL
    const prompts = result.results?.map((row: any) => ({
      ...row,
      image_url: row.r2_key ? `/api/uploads/image/${row.image_id}/download` : null,
      is_favorited: Boolean(row.is_favorited),
    })) || [];

    return c.json<ApiResponse>({
      success: true,
      message: 'Prompts retrieved successfully',
      data: prompts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });

  } catch (error) {
    console.error('Error fetching prompts:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch prompts',
      data: null,
    }, 500);
  }
});

// 獲取單個 Prompt
promptsRouter.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const currentUserId = c.req.header('x-user-id') || 'anonymous';

    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid prompt ID',
        data: null,
      }, 400);
    }

    const query = `
      SELECT
        pg.*,
        i.r2_key,
        CASE WHEN pf.prompt_id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
      FROM prompt_gallery pg
      LEFT JOIN images i ON pg.image_id = i.id
      LEFT JOIN prompt_favorites pf ON pg.id = pf.prompt_id AND pf.user_id = ?
      WHERE pg.id = ?
    `;

    const result = await c.env.DB.prepare(query)
      .bind(currentUserId, id)
      .first<any>();

    if (!result) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Prompt not found',
        data: null,
      }, 404);
    }

    const prompt = {
      ...result,
      image_url: result.r2_key ? `/api/uploads/image/${result.image_id}/download` : null,
      is_favorited: Boolean(result.is_favorited),
    };

    return c.json<ApiResponse>({
      success: true,
      message: 'Prompt retrieved successfully',
      data: prompt,
    });

  } catch (error) {
    console.error('Error fetching prompt:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch prompt',
      data: null,
    }, 500);
  }
});

// 創建新 Prompt
promptsRouter.post('/', zValidator('json', CreatePromptSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const userId = c.req.header('x-user-id') || 'anonymous';

    const result = await c.env.DB.prepare(`
      INSERT INTO prompt_gallery (prompt, description, category, image_id, user_id)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      data.prompt,
      data.description || null,
      data.category,
      data.image_id || null,
      userId
    ).first();

    return c.json<ApiResponse>({
      success: true,
      message: 'Prompt created successfully',
      data: result,
    }, 201);

  } catch (error) {
    console.error('Error creating prompt:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to create prompt',
      data: null,
    }, 500);
  }
});

// 收藏/取消收藏 Prompt
promptsRouter.post('/:id/favorite', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const userId = c.req.header('x-user-id') || 'anonymous';

    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid prompt ID',
        data: null,
      }, 400);
    }

    // 檢查是否已收藏
    const existing = await c.env.DB.prepare(`
      SELECT * FROM prompt_favorites WHERE prompt_id = ? AND user_id = ?
    `).bind(id, userId).first();

    if (existing) {
      // 取消收藏
      await c.env.DB.prepare(`
        DELETE FROM prompt_favorites WHERE prompt_id = ? AND user_id = ?
      `).bind(id, userId).run();

      await c.env.DB.prepare(`
        UPDATE prompt_gallery SET favorite_count = favorite_count - 1 WHERE id = ?
      `).bind(id).run();

      return c.json<ApiResponse>({
        success: true,
        message: 'Prompt unfavorited successfully',
        data: { is_favorited: false },
      });
    } else {
      // 添加收藏
      await c.env.DB.prepare(`
        INSERT INTO prompt_favorites (prompt_id, user_id) VALUES (?, ?)
      `).bind(id, userId).run();

      await c.env.DB.prepare(`
        UPDATE prompt_gallery SET favorite_count = favorite_count + 1 WHERE id = ?
      `).bind(id).run();

      return c.json<ApiResponse>({
        success: true,
        message: 'Prompt favorited successfully',
        data: { is_favorited: true },
      });
    }

  } catch (error) {
    console.error('Error toggling favorite:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to toggle favorite',
      data: null,
    }, 500);
  }
});

// 記錄 Prompt 使用
promptsRouter.post('/:id/use', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid prompt ID',
        data: null,
      }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE prompt_gallery SET use_count = use_count + 1 WHERE id = ?
    `).bind(id).run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Prompt use recorded',
      data: null,
    });

  } catch (error) {
    console.error('Error recording prompt use:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to record prompt use',
      data: null,
    }, 500);
  }
});

// 刪除 Prompt
promptsRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const userId = c.req.header('x-user-id') || 'anonymous';

    if (isNaN(id)) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Invalid prompt ID',
        data: null,
      }, 400);
    }

    // 檢查權限（只能刪除自己的 prompt）
    const prompt = await c.env.DB.prepare(`
      SELECT user_id FROM prompt_gallery WHERE id = ?
    `).bind(id).first<{ user_id: string }>();

    if (!prompt) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Prompt not found',
        data: null,
      }, 404);
    }

    if (prompt.user_id !== userId && userId !== 'admin') {
      return c.json<ApiResponse>({
        success: false,
        message: 'Unauthorized to delete this prompt',
        data: null,
      }, 403);
    }

    await c.env.DB.prepare(`DELETE FROM prompt_gallery WHERE id = ?`).bind(id).run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Prompt deleted successfully',
      data: null,
    });

  } catch (error) {
    console.error('Error deleting prompt:', error);
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to delete prompt',
      data: null,
    }, 500);
  }
});
