# 🚀 Digital Business Card - 快速啟動指南

## ⚡ 一鍵啟動

```bash
# 運行快速啟動腳本
npm run quick-start

# 或者直接執行
./scripts/quick-start.sh
```

## 🔧 手動啟動 (兩個終端機)

### 終端機 1: 啟動後端
```bash
npm run dev:workers
# 後端運行在 http://localhost:8787
```

### 終端機 2: 啟動前端
```bash
npm run dev
# 前端運行在 http://localhost:3000
```

## ✅ 驗證運行狀態

```bash
# 檢查環境
npm run check-env

# 健康檢查
npm run health-check

# 手動檢查
curl http://localhost:8787/health
curl http://localhost:3000/api/uploads/stats
```

## 🌐 訪問地址

- **首頁**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **腳本管理**: http://localhost:3000/script
- **圖片處理**: http://localhost:3000/slideswipe

## 🐛 常見問題

### 端口被佔用
```bash
pkill -f "wrangler dev"
pkill -f "next dev"
```

### 認證問題
```bash
unset CLOUDFLARE_API_TOKEN
wrangler login
```

### 數據庫問題
```bash
npm run workers:db:migrate:local
```

## 📚 詳細文檔

- **完整文檔**: README.md
- **執行指南**: .cursor/rules/execution-guide.mdc
- **執行總結**: EXECUTION_SUMMARY.md

## 🎯 開發流程

1. **啟動服務**: `npm run quick-start`
2. **開發**: 修改代碼，自動熱重載
3. **檢查**: `npm run health-check`
4. **部署**: `npm run build:workers`

---

**💡 提示**: 首次使用請運行 `npm run quick-start` 進行環境檢查！
