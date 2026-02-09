import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 靜態輸出模式 - 用於 Cloudflare Pages 部署
  output: "export",
  // 靜態輸出模式下需要禁用圖片優化
  images: {
    unoptimized: true,
  },
  // 放寬 ESLint 與型別檢查，以便先驗證整合骨架可編譯
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 注意：rewrites() 在 output: "export" 模式下不支援
  // API 請求需要直接呼叫 Workers API endpoint
};

export default nextConfig;
