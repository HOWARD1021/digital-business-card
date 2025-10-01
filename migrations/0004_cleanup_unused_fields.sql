-- 資料庫清理遷移
-- 移除未使用的欄位和索引
-- 創建時間: 2025-08-25

-- 步驟 1: 刪除多餘的索引
DROP INDEX IF EXISTS idx_images_processing_status;
DROP INDEX IF EXISTS idx_images_source_media;

-- 步驟 2: 由於 SQLite 不支持 DROP COLUMN，我們需要重建表
-- 創建新的優化表結構
CREATE TABLE images_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT DEFAULT 'anonymous',
  description TEXT,
  tags TEXT,
  source_media TEXT,
  category INTEGER DEFAULT 3
);

-- 步驟 3: 複製現有資料 (排除多餘欄位)
INSERT INTO images_new (
  id, filename, original_filename, r2_key, file_size, mime_type,
  upload_time, user_id, description, tags, source_media, category
)
SELECT 
  id, filename, original_filename, r2_key, file_size, mime_type,
  upload_time, user_id, description, tags, source_media, category
FROM images;

-- 步驟 4: 重命名表
DROP TABLE images;
ALTER TABLE images_new RENAME TO images;

-- 步驟 5: 重建必要的索引
CREATE INDEX idx_images_category ON images(category);
CREATE INDEX idx_images_upload_time ON images(upload_time DESC);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_r2_key ON images(r2_key);

-- 步驟 6: 添加新的複合索引以提升性能
CREATE INDEX idx_images_category_upload_time ON images(category, upload_time DESC);
CREATE INDEX idx_images_user_category ON images(user_id, category);

-- 步驟 7: 清理冗餘數據
UPDATE images SET 
  tags = NULL 
WHERE tags = '["dashboard","upload"]';

UPDATE images SET 
  source_media = NULL 
WHERE source_media = 'Dashboard Upload';

-- 步驟 8: 優化描述欄位 (移除自動生成的描述)
UPDATE images SET 
  description = NULL 
WHERE description LIKE 'Uploaded via dashboard - %';

-- 完成清理
