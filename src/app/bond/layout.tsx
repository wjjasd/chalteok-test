import type { Metadata } from 'next'
import KakaoSdkPreload from '@/components/KakaoSdkPreload'
import { SITE_OG } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: 'https://chalteok.com/bond' },
  title: '찰떡궁합 테스트 — 연인·파트너와의 관계 적합도 확인 | 찰떡 테스트',
  description:
    '두 사람의 관계를 8개 영역, 45문항으로 구조적으로 살펴보는 찰떡궁합 테스트. 회원가입 없이 무료로 할 수 있어요.',
  openGraph: {
    ...SITE_OG,
    url: 'https://chalteok.com/bond',
    images: [{ url: '/og/root.png', width: 1200, height: 630 }],
    title: '찰떡궁합 테스트 — 연인·파트너와의 관계 적합도 확인 | 찰떡 테스트',
    description:
      '두 사람의 관계를 8개 영역, 45문항으로 구조적으로 살펴보는 찰떡궁합 테스트. 회원가입 없이 무료로 할 수 있어요.',
  },
}

export default function BondLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 공유 링크로 /bond/result 직접 진입 시에도 카카오 SDK를 즉시 받도록 layout에서 선로드 */}
      <KakaoSdkPreload />
      {children}
    </>
  )
}
