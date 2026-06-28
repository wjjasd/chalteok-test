import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '찰떡궁합 테스트 — 연인·파트너와의 관계 적합도 확인 | 찰떡 테스트',
  description:
    '두 사람의 관계를 8개 영역, 45문항으로 구조적으로 살펴보는 찰떡궁합 테스트. 서버 저장 없이 무료 제공.',
  openGraph: {
    title: '찰떡궁합 테스트 — 연인·파트너와의 관계 적합도 확인 | 찰떡 테스트',
    description:
      '두 사람의 관계를 8개 영역, 45문항으로 구조적으로 살펴보는 찰떡궁합 테스트. 서버 저장 없이 무료 제공.',
  },
}

export default function BondLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
