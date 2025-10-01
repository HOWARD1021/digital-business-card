-- 腳本分類表
CREATE TABLE script_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  emoji TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 腳本模板表
CREATE TABLE script_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES script_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version TEXT,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  translation TEXT,
  tags TEXT, -- JSON array as string
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'draft')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 腳本評分表
CREATE TABLE script_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id INTEGER NOT NULL REFERENCES script_templates(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(script_id, user_id) -- 每個用戶對每個腳本只能評分一次
);

-- 腳本使用統計表
CREATE TABLE script_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id INTEGER NOT NULL REFERENCES script_templates(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('view', 'copy', 'download', 'generate')),
  metadata TEXT, -- JSON as string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 腳本截圖表
CREATE TABLE script_screenshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id INTEGER NOT NULL REFERENCES script_templates(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 腳本生成記錄表
CREATE TABLE script_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id INTEGER NOT NULL REFERENCES script_templates(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  parameters TEXT, -- JSON as string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用戶表 (簡化版)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建索引以提高查詢性能
CREATE INDEX idx_script_templates_category_id ON script_templates(category_id);
CREATE INDEX idx_script_templates_status ON script_templates(status);
CREATE INDEX idx_script_templates_created_at ON script_templates(created_at);
CREATE INDEX idx_script_ratings_script_id ON script_ratings(script_id);
CREATE INDEX idx_script_usage_script_id ON script_usage(script_id);
CREATE INDEX idx_script_usage_created_at ON script_usage(created_at);
CREATE INDEX idx_script_screenshots_script_id ON script_screenshots(script_id);
CREATE INDEX idx_script_generations_script_id ON script_generations(script_id);

-- 插入初始分類數據
INSERT INTO script_categories (name, slug, description, emoji) VALUES
('垂直三分屏影片腳本', 'triple-screen', '專業的垂直三分屏影片腳本，適用於短視頻平台', '🎬'),
('ASMR 分靈體摧毀系列', 'asmr-destroy', 'ASMR 風格的分靈體摧毀主題腳本', '🎭'),
('小貓咪魔法水晶球系列', 'kitten-jelly', '可愛的小貓咪與魔法水晶球互動腳本', '🐱'),
('非洲祝福生日系列', 'africa-birthday', '非洲風格的生日祝福腳本', '🎉'),
('垂直三聯畫電影導演系列', 'vertical-triptych', '電影導演風格的垂直三聯畫腳本', '🎞️');
