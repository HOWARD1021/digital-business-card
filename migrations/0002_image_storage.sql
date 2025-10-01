-- 圖片存儲功能數據庫遷移
-- 創建時間: 2025-01-28
-- 目的: 為影視作品圖片存儲和管理提供數據結構

-- 圖片存儲主表
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,                    -- 系統生成的文件名 (timestamp_random.ext)
  original_filename TEXT NOT NULL,           -- 用戶上傳的原始文件名
  r2_key TEXT NOT NULL UNIQUE,              -- R2 存儲的 key (images/filename)
  file_size INTEGER NOT NULL,               -- 文件大小 (bytes)
  mime_type TEXT NOT NULL,                  -- MIME 類型 (image/jpeg, image/png, image/webp)
  width INTEGER,                            -- 圖片寬度 (像素)
  height INTEGER,                           -- 圖片高度 (像素)
  upload_time DATETIME DEFAULT CURRENT_TIMESTAMP, -- 上傳時間
  user_id TEXT DEFAULT 'anonymous',         -- 用戶 ID (暫時使用字符串)
  description TEXT,                         -- 圖片描述
  tags TEXT,                               -- 標籤 (JSON 數組字符串)
  source_media TEXT,                       -- 來源影視作品名稱
  processing_status TEXT DEFAULT 'completed' -- 處理狀態: pending, processing, completed, failed
);

-- 創建索引提高查詢性能
CREATE INDEX idx_images_upload_time ON images(upload_time DESC);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_r2_key ON images(r2_key);
CREATE INDEX idx_images_processing_status ON images(processing_status);
CREATE INDEX idx_images_source_media ON images(source_media);

-- 插入一些測試數據 (可選)
INSERT INTO images (
  filename, original_filename, r2_key, file_size, mime_type, 
  width, height, user_id, description, tags, source_media
) VALUES 
(
  '1738048800000_abc123.jpg', 
  'sample_movie_poster.jpg', 
  'images/1738048800000_abc123.jpg', 
  1024000, 
  'image/jpeg',
  800, 
  1200, 
  'test_user', 
  '測試影視作品海報', 
  '["影視", "海報", "測試"]',
  '測試電影'
);
