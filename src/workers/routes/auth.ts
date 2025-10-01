import { Hono } from 'hono';
import { Env, ApiResponse } from '../../types';

export const authRouter = new Hono<{ Bindings: Env }>();

// 認證相關端點將在後續實現
authRouter.all('*', async (c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'Auth endpoint not implemented yet',
    data: null,
  }, 501);
});