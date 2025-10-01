-- 新遷移文件: migrations/0003_image_categories.sql

-- 為圖片表添加分類字段
ALTER TABLE images ADD COLUMN category INTEGER DEFAULT 3;

-- 創建分類索引
CREATE INDEX idx_images_category ON images(category);

-- 更新現有圖片為未分類 (category 3)
UPDATE images SET category = 3 WHERE category IS NULL;

-- 添加分類註釋
-- category 1: 黑色首頁圖 (原圖)
-- category 2: 風格覆蓋圖 (最多8張)
-- category 3: 其他未分類圖片
