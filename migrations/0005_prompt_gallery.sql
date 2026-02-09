-- Prompt Gallery 功能數據庫遷移
-- 創建時間: 2025-01-31
-- 目的: 為 Prompt Gallery 提供數據結構，讓用戶可以收藏和重用優秀的 prompts

-- Prompt 畫廊主表
CREATE TABLE prompt_gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt TEXT NOT NULL,                      -- Prompt 內容
  description TEXT,                          -- Prompt 描述
  image_id INTEGER REFERENCES images(id),    -- 關聯的圖片 ID
  category TEXT DEFAULT 'style_transfer',    -- 類別（風格轉換、I2I 等）
  favorite_count INTEGER DEFAULT 0,          -- 收藏次數
  use_count INTEGER DEFAULT 0,               -- 使用次數
  user_id TEXT DEFAULT 'anonymous',          -- 創建者 ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prompt 收藏表
CREATE TABLE prompt_favorites (
  prompt_id INTEGER NOT NULL REFERENCES prompt_gallery(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(prompt_id, user_id)
);

-- 創建索引提高查詢性能
CREATE INDEX idx_prompt_gallery_favorite_count ON prompt_gallery(favorite_count DESC);
CREATE INDEX idx_prompt_gallery_use_count ON prompt_gallery(use_count DESC);
CREATE INDEX idx_prompt_gallery_created_at ON prompt_gallery(created_at DESC);
CREATE INDEX idx_prompt_gallery_category ON prompt_gallery(category);
CREATE INDEX idx_prompt_gallery_user_id ON prompt_gallery(user_id);
CREATE INDEX idx_prompt_favorites_user_id ON prompt_favorites(user_id);

-- 插入一些測試數據
INSERT INTO prompt_gallery (prompt, description, category, favorite_count, use_count, user_id) VALUES
(
  'Transform this image into a beautiful watercolor painting with soft colors and artistic brush strokes',
  '水彩畫風格 - 柔和色彩',
  'style_transfer',
  15,
  42,
  'system'
),
(
  'Convert to Studio Ghibli anime style with dreamy atmosphere and detailed backgrounds',
  '吉卜力工作室風格 - 夢幻氛圍',
  'style_transfer',
  28,
  65,
  'system'
),
(
  'Transform into cyberpunk style with neon lights, dark atmosphere and futuristic elements',
  '賽博朋克風格 - 霓虹燈光',
  'style_transfer',
  12,
  38,
  'system'
),
(
  'Convert to oil painting style in the manner of Van Gogh with bold brushstrokes',
  '梵谷油畫風格 - 粗獷筆觸',
  'style_transfer',
  20,
  51,
  'system'
);
