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
  icons: { icon: '/icon', apple: '/icon' },
  title: '찰떡 — 자기 성찰 테스트',
  description: '나와 관계를 더 잘 이해하기 위한 자기 성찰 테스트. 찰떡 궁합 테스트 · 애착유형 테스트.',
  verification: {
    google: 'qi_yQVNsvaYzB1jVzibqfu4wEWg3JnrEaxFX2whw4B0',
    other: { 'naver-site-verification': ['e560414ddddef4627dd234b801ea6bade0bc6a4d'] },
  },
  openGraph: {
    url: 'https://chalteok.com',
    type: 'website',
    siteName: '찰떡',
    title: '찰떡 — 자기 성찰 테스트',
    description: '나와 관계를 더 잘 이해하기 위한 자기 성찰 테스트',
    images: [{ url: '/og/root.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  )
}
