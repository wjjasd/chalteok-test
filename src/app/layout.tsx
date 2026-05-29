import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://chalteok.kro.kr'),
  title: '찰떡 궁합 테스트',
  description: '두 사람의 관계 적합도를 구조화된 설문을 통해 성찰하는 도구입니다.',
  openGraph: {
    url: 'https://chalteok.kro.kr',
    type: 'website',
    siteName: '찰떡 궁합 테스트',
    title: '찰떡 궁합 테스트',
    description: '자기 성찰을 위한 찰떡 궁합 테스트',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">
        {children}
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
