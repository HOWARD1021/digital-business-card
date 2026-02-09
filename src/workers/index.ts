import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';

import { Env, ApiResponse } from '../types';
import { uploadsRouter } from './routes/uploads';
import { i2iRouter } from './routes/i2i';
import { promptsRouter } from './routes/prompts';

type Variables = {};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CORS 中間件
app.use('*', async (c, next) => {
  const corsOrigin = c.env?.CORS_ORIGIN || '*';
  const corsMiddleware = cors({
    origin: corsOrigin === '*' ? '*' : [corsOrigin],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  });
  return corsMiddleware(c, next);
});

// 錯誤處理中間件
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json<ApiResponse>({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
  }, 500);
});

// 健康檢查
app.get('/health', (c) => {
  return c.json<ApiResponse>({
    success: true,
    message: 'Digital Business Card API is running',
    data: {
      environment: c.env?.ENVIRONMENT || 'development',
      timestamp: new Date().toISOString(),
    }
  });
});

// API 路由
app.route('/api/uploads', uploadsRouter);
app.route('/api/i2i', i2iRouter);
app.route('/api/prompts', promptsRouter);

// 404 處理
app.notFound((c) => {
  return c.json<ApiResponse>({
    success: false,
    message: 'API endpoint not found',
    data: null,
  }, 404);
});

export default app;
