import type { NextConfig } from "next";

// 정적 export (Cloudflare Pages). 보안 헤더(CSP 등)는 public/_headers, 옛 URL 리다이렉트는 public/_redirects
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
};

export default nextConfig;
