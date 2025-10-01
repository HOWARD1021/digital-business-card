import { Hono } from 'hono';
import { Env, ApiResponse } from '../../types';

export const scriptsRouter = new Hono<{ Bindings: Env }>();

// 獲取腳本分類
scriptsRouter.get('/categories', async (c) => {
  return c.json<ApiResponse>({
    success: true,
    message: 'Script categories endpoint - not implemented yet',
    data: [],
  });
});

// 獲取腳本列表
scriptsRouter.get('/', async (c) => {
  return c.json<ApiResponse>({
    success: true,
    message: 'Scripts endpoint - not implemented yet',
    data: [],
  });
});

// 其他腳本相關端點將在後續實現
scriptsRouter.all('*', async (c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'Script endpoint not implemented yet',
    data: null,
  }, 501);
});