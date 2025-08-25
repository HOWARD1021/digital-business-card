# 🔐 安全配置指南

## 📋 概述

此項目使用 Cloudflare Workers，包含敏感配置信息需要妥善保護。

## 🚨 敏感信息

以下信息**絕對不能**提交到 Git：
- Database IDs
- KV Namespace IDs  
- JWT Secrets
- API Tokens
- 生產環境配置

## 🛡️ 安全設置

### 1. 初始設置

```bash
# 運行環境設置腳本
./scripts/setup-env.sh
```

### 2. 手動設置

如果腳本失敗，請手動執行：

```bash
# 1. 複製環境變量模板
cp env.example .env

# 2. 編輯 .env 文件，填入實際值
nano .env

# 3. 複製 wrangler 配置模板  
cp wrangler.toml.example wrangler.toml

# 4. 手動替換 wrangler.toml 中的佔位符
```

### 3. 獲取必要的 IDs

```bash
# 獲取 Database IDs
wrangler d1 list

# 獲取 KV Namespace IDs
wrangler kv namespace list

# 創建新的資源（如需要）
wrangler d1 create your-database-name
wrangler kv namespace create YOUR_NAMESPACE
wrangler r2 bucket create your-bucket-name
```

## 📁 文件結構

```
├── wrangler.toml.example    # 安全的配置模板（可提交）
├── wrangler.toml           # 實際配置（不提交）
├── env.example             # 環境變量模板（可提交）  
├── .env                    # 實際環境變量（不提交）
└── .gitignore              # 忽略敏感文件
```

## ✅ 安全檢查清單

- [ ] `wrangler.toml` 在 `.gitignore` 中
- [ ] `.env` 在 `.gitignore` 中  
- [ ] 所有敏感 IDs 都使用環境變量
- [ ] 生產環境使用強 JWT secret
- [ ] API Token 妥善保存
- [ ] 定期輪換密鑰

## 🚀 部署

### 開發環境
```bash
npm run dev:workers
```

### 生產環境  
```bash
# 確保環境變量正確設置
wrangler deploy --env production
```

## 🆘 如果敏感信息已提交

如果意外提交了敏感信息：

1. **立即撤銷所有相關密鑰**
2. **從 Git 歷史中移除**：
   ```bash
   # 移除文件
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch wrangler.toml' \
   --prune-empty --tag-name-filter cat -- --all
   
   # 強制推送
   git push origin --force --all
   ```
3. **重新生成所有密鑰**
4. **更新配置**

## 📞 緊急聯絡

如發現安全問題，請立即：
1. 撤銷相關 API Token
2. 更換所有密鑰
3. 檢查訪問日誌
