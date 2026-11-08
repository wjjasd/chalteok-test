import KakaoSdkPreload from '@/components/KakaoSdkPreload'

// 소개 화면 진입 시점부터 카카오 SDK를 받아둔다 (결과 공유 링크로 직접 들어와도 동일)
export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KakaoSdkPreload />
      {children}
    </>
  )
}
