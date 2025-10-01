# 🚀 Cloudflare Workers 新專案完整設置指南

## 第一步：安裝和初始化

### 1.1 安裝 Wrangler (本地)
```bash
# 在新專案根目錄
npm install wrangler --save-dev

# 或者加入 package.json
npm init -y
npm install wrangler typescript @types/node --save-dev
```

### 1.2 登入 Cloudflare (只需做一次)
```bash
# 如果是本地安裝
npx wrangler login

# 或者全域安裝後
wrangler login
```

## 第二步：創建雲端資源

### 2.1 創建 D1 數據庫
```bash
npx wrangler d1 create your-project-db
# 記錄返回的 database_id

# 範例輸出：
# ✅ Successfully created DB 'your-project-db' in region APAC
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2.2 創建 R2 存儲桶
```bash
npx wrangler r2 bucket create your-project-files
# 記錄桶名稱
```

### 2.3 創建 KV 命名空間
```bash
npx wrangler kv namespace create CACHE
# 記錄返回的 id

npx wrangler kv namespace create CACHE --preview
# 記錄返回的 preview_id

# 範例輸出：
# id = "5ebf13dc3c294fb78b675a6baf7ed9a8"
# preview_id = "bb1203ca0fd44854841db0993500739f"
```

## 第三步：項目結構設置

### 3.1 創建基本目錄結構
```
your-project/
├── src/
│   ├── workers/
│   │   ├── index.ts          # Workers 入口
│   │   └── routes/           # API 路由
│   ├── types/
│   │   └── index.ts          # 類型定義
│   └── lib/
│       └── api-client.ts     # API 客戶端
├── migrations/               # 數據庫遷移
├── wrangler.toml            # Cloudflare 配置
└── package.json
```

### 3.2 創建 wrangler.toml
```toml
name = "your-project-name"
main = "src/workers/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

# D1 數據庫
[[d1_databases]]
binding = "DB"
database_name = "your-project-db"
database_id = "填入第2.1步獲得的ID"

# R2 存儲
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "your-project-files"

# KV 存儲
[[kv_namespaces]]
binding = "CACHE"
id = "填入第2.3步獲得的ID"
preview_id = "填入第2.3步獲得的preview_id"

# 環境變量
[vars]
ENVIRONMENT = "development"
CORS_ORIGIN = "*"
JWT_SECRET = "dev-secret-change-me"
```

## 第四步：代碼模板

### 4.1 Workers 入口 (src/workers/index.ts)
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS 中間件
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env?.CORS_ORIGIN || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  });
  return corsMiddleware(c, next);
});

// 健康檢查
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'API is running',
    data: {
      environment: c.env?.ENVIRONMENT || 'development',
      timestamp: new Date().toISOString(),
    }
  });
});

// 測試數據庫連接
app.get('/test-db', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT 1 as test').first();
    return c.json({
      success: true,
      message: 'Database connected',
      data: result
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
```

### 4.2 Package.json 腳本
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "dev:workers": "wrangler dev src/workers/index.ts",
    "quick-start": "concurrently -k -n workers,web -c blue,green \"wrangler dev src/workers/index.ts\" \"next dev --turbopack\"",
    "build:workers": "wrangler deploy src/workers/index.ts",
    "db:migrate": "wrangler d1 migrations apply your-project-db",
    "db:migrate:local": "wrangler d1 migrations apply your-project-db --local"
  }
}
```

## 第五步：數據庫遷移 (可選)

### 5.1 創建遷移文件
```bash
mkdir -p migrations
```

### 5.2 創建初始遷移 (migrations/0001_initial.sql)
```sql
-- 創建用戶表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建項目表 (根據你的需求修改)
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  user_id TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 運行遷移
```bash
# 本地開發
npx wrangler d1 migrations apply your-project-db --local

# 生產環境
npx wrangler d1 migrations apply your-project-db
```

## 第六步：測試和部署

### 6.1 本地測試
```bash
# 啟動開發服務器
npm run dev:workers

# 測試健康檢查
curl http://localhost:8787/health

# 測試數據庫連接
curl http://localhost:8787/test-db
```

### 6.2 部署到生產
```bash
# 部署 Workers
npm run build:workers

# 運行生產遷移
npx wrangler d1 migrations apply your-project-db
```

## 🔍 常見問題排除

### Q1: "wrangler command not found"
```bash
# 解決方案：使用 npx
npx wrangler --version

# 或者安裝到全域
npm install -g wrangler
```

### Q2: "Database binding not found"
- 檢查 wrangler.toml 中的 database_id 是否正確
- 確認已運行 `wrangler d1 create`

### Q3: "CORS 錯誤"
- 檢查 CORS_ORIGIN 設置
- 確認前端請求 URL 正確

## 📝 檢查清單

- [ ] 安裝 wrangler
- [ ] 登入 Cloudflare
- [ ] 創建 D1 數據庫
- [ ] 創建 R2 存儲桶
- [ ] 創建 KV 命名空間
- [ ] 配置 wrangler.toml
- [ ] 創建 Workers 代碼
- [ ] 添加 package.json 腳本
- [ ] 本地測試成功
- [ ] 部署到生產

完成這些步驟後，你就有了一個完整的 Cloudflare Workers 專案設置！