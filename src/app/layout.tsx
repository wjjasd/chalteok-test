import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SITE_TITLE, SITE_DESC, SITE_OG } from '@/lib/site'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://chalteok.com'),
  title: SITE_TITLE,
  description: SITE_DESC,
  applicationName: '찰떡 테스트',
  keywords: ['심리테스트', '무료 심리테스트', '심리테스트 모음', '성격 테스트', '연애 테스트', '궁합 테스트', '애착유형 테스트', '퇴사 테스트', '찰떡 테스트'],
  verification: {
    google: 'qi_yQVNsvaYzB1jVzibqfu4wEWg3JnrEaxFX2whw4B0',
    other: { 'naver-site-verification': ['e560414ddddef4627dd234b801ea6bade0bc6a4d'] },
  },
  // canonical은 페이지별로 지정한다 (루트에 두면 canonical 없는 하위 페이지가 전부 홈을 가리키게 됨)
  openGraph: SITE_OG,
  twitter: { card: 'summary_large_image' },
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
              alternateName: ['찰떡테스트', 'chalteok'],
              url: 'https://chalteok.com',
              inLanguage: 'ko-KR',
              description: SITE_DESC,
            }),
          }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-GM9GL28QFG" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GM9GL28QFG');`}
        </Script>
        {children}
      </body>
    </html>
  )
}
