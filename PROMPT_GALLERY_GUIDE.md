# 🎨 Prompt Gallery 功能使用指南

## ✅ 功能實現狀態

### 已完成功能
- ✅ 數據庫設計（prompt_gallery + prompt_favorites 表）
- ✅ 完整的 REST API（GET, POST, FAVORITE, USE, DELETE）
- ✅ Prompt Gallery 前端頁面（`/prompts`）
- ✅ I2I 轉換頁面（`/transform`）
- ✅ 完整工作流整合

### 測試狀態
- ✅ Workers API 健康檢查通過
- ✅ Prompts API 正常返回數據
- ✅ 收藏功能正常工作
- ✅ 雙伺服器正常運行

---

## 🚀 快速開始

### 1. 啟動開發伺服器

```bash
npm run quick-start
```

這將同時啟動：
- **Next.js**: http://localhost:3001
- **Workers API**: http://localhost:8787

### 2. 訪問 Prompt Gallery

打開瀏覽器訪問：
```
http://localhost:3001/prompts
```

---

## 📖 功能說明

### Prompt Gallery (`/prompts`)

**主要功能：**
1. **瀏覽 Prompts**
   - 網格展示所有 prompts
   - 顯示圖片預覽（如果有）
   - 顯示收藏數和使用次數

2. **排序選項**
   - 🔥 **最受歡迎**：按收藏數排序
   - 📈 **最常使用**：按使用次數排序
   - 🕐 **最新添加**：按創建時間排序

3. **操作功能**
   - ❤️ **收藏/取消收藏**：點擊愛心圖標
   - 📋 **複製 Prompt**：快速複製到剪貼板
   - ✨ **使用此 Prompt**：跳轉到轉換頁面

### I2I 轉換頁面 (`/transform`)

**工作流程：**

1. **上傳原始圖片**
   - 支持拖拽上傳
   - 支持 JPG, PNG, WebP 格式

2. **輸入或選擇 Prompt**
   - 手動輸入
   - 從 Prompt Gallery 跳轉時自動填充

3. **執行轉換**
   - AI 處理（需要配置 API Keys）
   - 顯示進度和結果

4. **自動保存**
   - 轉換成功後自動保存到 Gallery
   - 可供其他用戶瀏覽和重用

---

## 🔧 API 端點說明

### 1. 獲取 Prompts 列表
```bash
GET http://localhost:8787/api/prompts

查詢參數：
- sort: popular | recent | most_used
- page: 頁碼（默認 1）
- limit: 每頁數量（默認 20）
- category: 分類過濾
```

### 2. 獲取單個 Prompt
```bash
GET http://localhost:8787/api/prompts/:id
```

### 3. 創建新 Prompt
```bash
POST http://localhost:8787/api/prompts
Content-Type: application/json

{
  "prompt": "Transform this image...",
  "description": "簡短描述",
  "category": "style_transfer",
  "image_id": 123
}
```

### 4. 收藏/取消收藏
```bash
POST http://localhost:8787/api/prompts/:id/favorite
Header: x-user-id: your-user-id
```

### 5. 記錄使用次數
```bash
POST http://localhost:8787/api/prompts/:id/use
```

### 6. 刪除 Prompt
```bash
DELETE http://localhost:8787/api/prompts/:id
Header: x-user-id: your-user-id
```

---

## 💡 使用場景

### 場景 1: 瀏覽並收藏優秀 Prompts
1. 訪問 `/prompts`
2. 瀏覽不同風格的 prompts
3. 點擊 ❤️ 收藏喜歡的 prompts
4. 使用"最受歡迎"排序查看最佳 prompts

### 場景 2: 使用 Prompt 進行 I2I 轉換
1. 在 Prompt Gallery 選擇一個 prompt
2. 點擊"使用此 Prompt"
3. 上傳您的圖片
4. 點擊"開始轉換"
5. 查看結果並自動保存到 Gallery

### 場景 3: 創建和分享您的 Prompt
1. 在 `/transform` 頁面創建新的 prompt
2. 執行成功的轉換
3. Prompt 自動保存到 Gallery
4. 其他用戶可以看到並重用

---

## 🗄️ 數據庫結構

### prompt_gallery 表
```sql
- id: 主鍵
- prompt: Prompt 內容
- description: 描述
- image_id: 關聯圖片 ID
- category: 分類（默認 style_transfer）
- favorite_count: 收藏次數
- use_count: 使用次數
- user_id: 創建者
- created_at: 創建時間
- updated_at: 更新時間
```

### prompt_favorites 表
```sql
- prompt_id: Prompt ID
- user_id: 用戶 ID
- created_at: 收藏時間
- PRIMARY KEY (prompt_id, user_id)
```

---

## 🎯 測試數據

系統預設了 4 個測試 prompts：

1. **水彩畫風格**
   - Prompt: "Transform this image into a beautiful watercolor painting..."
   - 收藏數: 15, 使用數: 42

2. **吉卜力風格**
   - Prompt: "Convert to Studio Ghibli anime style..."
   - 收藏數: 28, 使用數: 65

3. **賽博朋克風格**
   - Prompt: "Transform into cyberpunk style..."
   - 收藏數: 12, 使用數: 38

4. **梵谷油畫風格**
   - Prompt: "Convert to oil painting style in the manner of Van Gogh..."
   - 收藏數: 20, 使用數: 51

---

## ⚠️ 注意事項

### I2I 轉換需要 API Keys
要使用完整的 I2I 轉換功能，需要配置 Google AI API Keys：
1. 訪問 `/admin/keys`
2. 輸入管理員密碼
3. 配置 Primary 和 Secondary API Keys

### 伺服器端口
- 如果 port 3000 被佔用，Next.js 會使用 3001
- Workers API 固定使用 port 8787

### 用戶識別
- 當前使用 `x-user-id` header 識別用戶
- 默認為 "anonymous"
- 未來可整合完整的認證系統

---

## 🔍 測試命令

### 測試 API 健康狀態
```bash
curl http://localhost:8787/health
```

### 測試 Prompts API
```bash
# 獲取列表
curl http://localhost:8787/api/prompts

# 收藏 prompt
curl -X POST http://localhost:8787/api/prompts/1/favorite \
  -H "x-user-id: test-user"

# 記錄使用
curl -X POST http://localhost:8787/api/prompts/1/use
```

---

## 📝 下一步計劃

### 可選增強功能
- [ ] 添加搜索功能（按關鍵字搜索 prompts）
- [ ] 添加標籤系統（標記不同風格）
- [ ] 添加評論功能（用戶可以留言）
- [ ] 添加分享功能（分享 prompts 到社交媒體）
- [ ] 添加統計儀表板（查看最熱門的 prompts）
- [ ] 整合用戶系統（個人收藏頁面）
- [ ] 添加 Prompt 編輯功能
- [ ] 添加版本控制（追蹤 prompt 的修改歷史）

---

## 🎉 總結

Prompt Gallery 系統已經完全實現並可用！您現在可以：
1. ✅ 瀏覽和收藏優秀的 prompts
2. ✅ 一鍵使用 prompts 進行 I2I 轉換
3. ✅ 自動保存成功的 prompts 到 Gallery
4. ✅ 追蹤 prompts 的受歡迎程度和使用次數

**立即開始使用：**
```
http://localhost:3001/prompts
```

享受 AI 創作的樂趣！🎨✨
