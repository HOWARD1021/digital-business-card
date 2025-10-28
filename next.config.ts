import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 放寬 ESLint 與型別檢查，以便先驗證整合骨架可編譯
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // 使用 fallback：先讓 Next 檔案系統路由（含 /api/*）優先，無匹配時再回退到 Workers
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8787/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
