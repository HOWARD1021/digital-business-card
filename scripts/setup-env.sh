#!/bin/bash
# Cloudflare Workers 環境設置腳本

echo "🔧 設置 Cloudflare Workers 環境..."

# 檢查是否有 .env 文件
if [ ! -f ".env" ]; then
    echo "📋 創建 .env 文件..."
    cp env.example .env
    echo "⚠️  請編輯 .env 文件並填入實際的值"
    echo "   - 從 Cloudflare Dashboard 獲取 Database IDs"
    echo "   - 從 wrangler kv namespace list 獲取 KV IDs"
    echo "   - 生成安全的 JWT secrets"
    exit 1
fi

# 檢查是否有 wrangler.toml
if [ ! -f "wrangler.toml" ]; then
    echo "📋 從模板創建 wrangler.toml..."
    cp wrangler.toml.example wrangler.toml
    
    # 從 .env 讀取變量並替換
    source .env
    
    # 使用 sed 替換佔位符
    sed -i.bak "s/YOUR_DEV_DATABASE_ID/$DEV_DATABASE_ID/g" wrangler.toml
    sed -i.bak "s/YOUR_PROD_DATABASE_ID/$PROD_DATABASE_ID/g" wrangler.toml
    sed -i.bak "s/YOUR_KV_NAMESPACE_ID/$KV_NAMESPACE_ID/g" wrangler.toml
    sed -i.bak "s/YOUR_KV_PREVIEW_ID/$KV_PREVIEW_ID/g" wrangler.toml
    sed -i.bak "s/YOUR_DEV_KV_NAMESPACE_ID/$DEV_KV_NAMESPACE_ID/g" wrangler.toml
    sed -i.bak "s/YOUR_DEV_JWT_SECRET/$DEV_JWT_SECRET/g" wrangler.toml
    sed -i.bak "s/YOUR_PROD_JWT_SECRET/$PROD_JWT_SECRET/g" wrangler.toml
    
    # 刪除備份文件
    rm wrangler.toml.bak
    
    echo "✅ wrangler.toml 已創建並配置"
fi

echo "🚀 環境設置完成！"
echo "   - wrangler.toml 已配置（不會提交到 git）"
echo "   - .env 文件已創建（不會提交到 git）"
echo "   - 敏感信息已受到保護"

# 檢查 git 狀態
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo ""
    echo "🔒 Git 安全檢查："
    if git check-ignore wrangler.toml > /dev/null 2>&1; then
        echo "   ✅ wrangler.toml 已在 .gitignore 中"
    else
        echo "   ⚠️  wrangler.toml 不在 .gitignore 中！"
    fi
    
    if git check-ignore .env > /dev/null 2>&1; then
        echo "   ✅ .env 已在 .gitignore 中"
    else
        echo "   ⚠️  .env 不在 .gitignore 中！"
    fi
fi
