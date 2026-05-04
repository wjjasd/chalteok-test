import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: 'RFI — 관계 적합도 인터뷰',
  description: '두 사람의 관계 적합도를 구조화된 설문을 통해 성찰하는 도구입니다.',
  openGraph: {
    title: 'RFI — 관계 적합도 인터뷰',
    description: '자기 성찰을 위한 관계 적합도 인터뷰 도구',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">{children}</body>
    </html>
  )
}
