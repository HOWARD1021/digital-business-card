import { Hono } from 'hono';
import { Env, ApiResponse } from '../../types';

export const statsRouter = new Hono<{ Bindings: Env }>();

// 統計相關端點將在後續實現
statsRouter.all('*', async (c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'Stats endpoint not implemented yet',
    data: null,
  }, 501);
});