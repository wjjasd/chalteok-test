import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// 외부 출처 근거
// - GA4: src/app/layout.tsx (googletagmanager.com gtag.js)
// - Kakao JS SDK: src/app/{attachment,bond}/layout.tsx, src/lib/kakaoSdk.ts (developers.kakao.com)
// - Kakao AdFit: src/app/attachment/result/page.tsx, src/app/bond/result/ResultClient.tsx (t1.kakaocdn.net, 광고 iframe은 daum/kakao 도메인)
const cspDirectives = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
    "https://www.googletagmanager.com",
    "https://developers.kakao.com",
    "https://t1.kakaocdn.net",
    "https://*.kakaocdn.net",
    "https://*.daumcdn.net",
  ]
    .filter(Boolean)
    .join(" "),
  "style-src 'self' 'unsafe-inline'",
  // 광고 이미지·GA 픽셀·결과 이미지(canvas toDataURL) 대응
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
    "https://*.g.doubleclick.net",
    "https://*.google.com",
    "https://*.kakao.com",
    "https://*.kakaocdn.net",
    "https://*.daum.net",
    "https://*.daumcdn.net",
  ].join(" "),
  [
    "frame-src 'self'",
    "https://*.kakao.com",
    "https://*.kakaocdn.net",
    "https://*.daum.net",
    "https://*.daumcdn.net",
  ].join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
