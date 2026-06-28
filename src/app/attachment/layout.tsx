import type { Metadata } from 'next'

export const metadata: Metadata = {
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
  return <>{children}</>
}
