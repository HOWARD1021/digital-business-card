# Digital Business Card - API 文檔

## 概述

本文檔描述了 Digital Business Card 系統的 Cloudflare Workers API 端點。

## 基礎信息

- **Base URL**: `http://localhost:8787/api` (開發環境)
- **Authentication**: 使用 `x-user-id` header
- **Content Type**: `application/json` (除了文件上傳)

---

## 圖片管理 API

### 1. 上傳圖片

**端點**: `POST /uploads/image`

**Headers**:
```
Content-Type: multipart/form-data
x-user-id: anonymous
```

**參數**:
- `file` (file, required): 圖片文件
- `category` (number, optional): 分類 (1=首頁圖, 2=風格圖, 3=其他)
- `description` (string, optional): 圖片描述
- `source_media` (string, optional): 來源影視作品

**回應**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "id": 32,
    "filename": "1756127393485_jyxrqv.jpg",
    "original_filename": "008.jpg",
    "r2_key": "images/1756127393485_jyxrqv.jpg",
    "file_size": 47448,
    "mime_type": "image/jpeg",
    "width": null,
    "height": null,
    "upload_time": "2025-08-25 13:09:53",
    "user_id": "anonymous",
    "description": "Uploaded via dashboard - 008.jpg",
    "tags": ["dashboard", "upload"],
    "source_media": "Dashboard Upload",
    "processing_status": "completed",
    "category": 1
  }
}
```

**限制**:
- Category 1 (首頁圖) 只能有一張
- 支持的格式: JPG, PNG, WebP
- 最大文件大小: 10MB

---

### 2. 獲取圖片列表

**端點**: `GET /uploads/images`

**查詢參數**:
- `page` (number, default: 1): 頁碼
- `limit` (number, default: 20): 每頁數量
- `category` (number, optional): 篩選分類 (1, 2, 3)
- `user_id` (string, optional): 篩選用戶
- `processing_status` (string, optional): 篩選狀態

**回應**:
```json
{
  "success": true,
  "message": "Images retrieved successfully",
  "data": [
    {
      "id": 32,
      "filename": "1756127393485_jyxrqv.jpg",
      "original_filename": "008.jpg",
      "r2_key": "images/1756127393485_jyxrqv.jpg",
      "file_size": 47448,
      "mime_type": "image/jpeg",
      "width": null,
      "height": null,
      "upload_time": "2025-08-25 13:09:53",
      "user_id": "anonymous",
      "description": "Uploaded via dashboard - 008.jpg",
      "tags": ["dashboard", "upload"],
      "source_media": "Dashboard Upload",
      "processing_status": "completed",
      "category": 1
    }
  ]
}
```

---

### 3. 獲取單張圖片信息

**端點**: `GET /uploads/image/{id}`

**路徑參數**:
- `id` (number, required): 圖片 ID

**回應**:
```json
{
  "success": true,
  "message": "Image retrieved successfully",
  "data": {
    "id": 32,
    "filename": "1756127393485_jyxrqv.jpg",
    "original_filename": "008.jpg",
    "r2_key": "images/1756127393485_jyxrqv.jpg",
    "file_size": 47448,
    "mime_type": "image/jpeg",
    "width": null,
    "height": null,
    "upload_time": "2025-08-25 13:09:53",
    "user_id": "anonymous",
    "description": "Uploaded via dashboard - 008.jpg",
    "tags": ["dashboard", "upload"],
    "source_media": "Dashboard Upload",
    "processing_status": "completed",
    "category": 1
  }
}
```

---

### 4. 下載圖片

**端點**: `GET /uploads/image/{id}/download`

**路徑參數**:
- `id` (number, required): 圖片 ID

**回應**: 圖片二進制數據

**Headers**:
```
Content-Type: image/jpeg (或對應的 MIME 類型)
Content-Disposition: inline; filename="original_filename.jpg"
```

---

### 5. 更新圖片信息

**端點**: `PUT /uploads/image/{id}`

**Headers**:
```
Content-Type: application/json
x-user-id: anonymous
```

**路徑參數**:
- `id` (number, required): 圖片 ID

**Body**:
```json
{
  "category": 2,
  "description": "更新的描述",
  "source_media": "新的來源"
}
```

**回應**:
```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "id": 32,
    "category": 2,
    "description": "更新的描述",
    "source_media": "新的來源"
  }
}
```

**限制**:
- Category 1 (首頁圖) 只能有一張

---

### 6. 刪除圖片

**端點**: `DELETE /uploads/image/{id}`

**Headers**:
```
x-user-id: anonymous
```

**路徑參數**:
- `id` (number, required): 圖片 ID

**回應**:
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

### 7. 批量刪除圖片

**端點**: `DELETE /uploads/images`

**Headers**:
```
Content-Type: application/json
x-user-id: anonymous
```

**Body**:
```json
{
  "ids": [1, 2, 3]
}
```

**回應**:
```json
{
  "success": true,
  "message": "3 images deleted successfully",
  "data": {
    "deleted_count": 3,
    "failed_ids": []
  }
}
```

---

### 8. 獲取圖片統計

**端點**: `GET /uploads/stats`

**回應**:
```json
{
  "success": true,
  "message": "Image statistics retrieved successfully",
  "data": {
    "total_images": 9,
    "total_size": 23355994,
    "images_by_type": [
      {
        "mime_type": "image/png",
        "count": 8,
        "total_size": 23308546
      },
      {
        "mime_type": "image/jpeg",
        "count": 1,
        "total_size": 47448
      }
    ],
    "recent_uploads": [...]
  }
}
```

---

## 系統 API

### 1. 健康檢查

**端點**: `GET /health`

**回應**:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-08-25T13:09:53.000Z"
}
```

---

### 2. 資料庫測試

**端點**: `GET /uploads/test-db`

**回應**:
```json
{
  "success": true,
  "message": "Database connection test successful",
  "data": {
    "count": 9
  }
}
```

---

## 錯誤回應

所有 API 錯誤都返回以下格式：

```json
{
  "success": false,
  "message": "錯誤描述",
  "error": "詳細錯誤信息"
}
```

**常見錯誤碼**:
- `400 Bad Request`: 請求參數錯誤
- `404 Not Found`: 資源不存在
- `409 Conflict`: 資源衝突 (如 Category 1 已存在)
- `413 Payload Too Large`: 文件過大
- `415 Unsupported Media Type`: 不支持的文件格式
- `500 Internal Server Error`: 服務器內部錯誤

---

## 圖片分類系統

### 分類說明

- **Category 1 (首頁圖)**: 
  - 用途: Shorts 的原圖
  - 限制: 只能有一張
  - 標識: 🖤 首頁圖

- **Category 2 (風格圖)**:
  - 用途: Shorts 的風格變體
  - 限制: 建議 8 張
  - 標識: 🎨 風格圖

- **Category 3 (其他)**:
  - 用途: 未分類的圖片
  - 限制: 無限制
  - 標識: 📁 其他

### 使用流程

1. **上傳首頁圖**: 設置 `category=1`
2. **上傳風格圖**: 設置 `category=2` (最多 8 張)
3. **生成 Shorts**: 使用首頁圖 + 風格圖進行風格轉換展示

---

## 前端集成

### API 客戶端

使用 `src/lib/api-client.ts` 中的 `ApiClient` 類：

```typescript
import { apiClient } from '@/lib/api-client';

// 上傳圖片
const result = await apiClient.uploadImage(file, { category: 1 });

// 獲取圖片列表
const images = await apiClient.getImages({ category: 2 });

// 獲取圖片下載 URL
const url = apiClient.getImageDownloadUrl(imageId);
```

### 錯誤處理

```typescript
try {
  const result = await apiClient.uploadImage(file);
  console.log('上傳成功:', result);
} catch (error) {
  console.error('上傳失敗:', error.message);
}
```

---

## 開發環境

### 啟動服務

```bash
# 啟動 Cloudflare Workers
npm run dev:workers

# 啟動 Next.js 前端
npm run dev
```

### 測試 API

```bash
# 健康檢查
curl http://localhost:8787/health

# 獲取圖片列表
curl http://localhost:8787/api/uploads/images

# 上傳圖片
curl -X POST http://localhost:8787/api/uploads/image \
  -H "x-user-id: anonymous" \
  -F "file=@image.jpg" \
  -F "category=1"
```

---

## 注意事項

1. **本地開發**: R2 存儲在本地是模擬的，圖片實際存儲在內存中
2. **CORS**: 已配置允許前端跨域請求
3. **認證**: 目前使用簡單的 `x-user-id` header，生產環境需要實現真實認證
4. **文件限制**: 開發環境下文件大小和格式限制較寬鬆
5. **數據持久化**: 本地開發時數據存儲在 D1 模擬數據庫中

---

## 更新日誌

### v1.0.0 (2025-08-25)
- 初始版本
- 基本的圖片 CRUD 操作
- 圖片分類系統
- 統計功能
- Dashboard 集成
- Shorts 功能支持
