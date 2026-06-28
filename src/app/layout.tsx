import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://chalteok.com'),
  title: '찰떡 테스트 | 찰떡궁합 테스트 · 애착유형 테스트',
  description:
    '내 연애 스타일과 관계 적합도, 한 곳에서 확인하세요. 찰떡궁합 테스트(45문항)·애착유형 테스트 무료 제공. 개인정보는 기기 밖으로 나가지 않습니다.',
  verification: {
    google: 'qi_yQVNsvaYzB1jVzibqfu4wEWg3JnrEaxFX2whw4B0',
    other: { 'naver-site-verification': ['e560414ddddef4627dd234b801ea6bade0bc6a4d'] },
  },
  other: {
    'application-name': '찰떡 테스트',
  },
  openGraph: {
    url: 'https://chalteok.com',
    type: 'website',
    siteName: '찰떡 테스트',
    title: '찰떡 테스트 | 찰떡궁합 테스트 · 애착유형 테스트',
    description:
      '내 연애 스타일과 관계 적합도, 한 곳에서 확인하세요. 찰떡궁합 테스트(45문항)·애착유형 테스트 무료 제공.',
    images: [{ url: '/og/root.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '찰떡 테스트',
              url: 'https://chalteok.com',
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
