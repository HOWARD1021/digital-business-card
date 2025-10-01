import { Hono } from 'hono';
import { Env, ApiResponse } from '../../types';

export const ratingsRouter = new Hono<{ Bindings: Env }>();

// 評分相關端點將在後續實現
ratingsRouter.all('*', async (c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'Ratings endpoint not implemented yet',
    data: null,
  }, 501);
});