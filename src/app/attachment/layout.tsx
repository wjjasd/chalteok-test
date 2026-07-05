import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  alternates: { canonical: 'https://chalteok.com/attachment' },
  title: '애착유형 테스트 — 내 연애 패턴 파악하기 | 찰떡 테스트',
  description:
    '나는 고요한 바다형? 파도치는 바다형? 애착유형 테스트로 내 연애 패턴을 파악해보세요. 서버 저장 없이 무료 제공.',
  openGraph: {
    title: '애착유형 테스트 — 내 연애 패턴 파악하기 | 찰떡 테스트',
    description:
      '나는 고요한 바다형? 파도치는 바다형? 애착유형 테스트로 내 연애 패턴을 파악해보세요. 서버 저장 없이 무료 제공.',
  },
}

export default function AttachmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* /attachment 진입 즉시 카카오 SDK 로드 시작 — 12문항이라 quiz→result 이동이 빨라 useEffect 사전 로드만으론 부족 */}
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="afterInteractive" />
      {children}
    </>
  )
}
