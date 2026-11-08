import type { Metadata } from 'next'
import KakaoSdkPreload from '@/components/KakaoSdkPreload'
import { SITE_OG } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: 'https://chalteok.com/attachment' },
  title: '애착유형 테스트 — 내 연애 패턴 파악하기 | 찰떡 테스트',
  description:
    '나는 고요한 바다형? 파도치는 바다형? 애착유형 테스트로 내 연애 패턴을 파악해보세요. 서버 저장 없이 무료 제공.',
  openGraph: {
    ...SITE_OG,
    url: 'https://chalteok.com/attachment',
    images: [{ url: '/og/site.png', width: 1200, height: 630 }],
    title: '애착유형 테스트 — 내 연애 패턴 파악하기 | 찰떡 테스트',
    description:
      '나는 고요한 바다형? 파도치는 바다형? 애착유형 테스트로 내 연애 패턴을 파악해보세요. 서버 저장 없이 무료 제공.',
  },
}

export default function AttachmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* /attachment 진입 즉시 카카오 SDK 로드 시작 — 12문항이라 quiz→result 이동이 빨라 결과 화면에서 받기 시작하면 늦음 */}
      <KakaoSdkPreload />
      {children}
    </>
  )
}
