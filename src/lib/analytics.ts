// GA4 이벤트 헬퍼. gtag는 src/app/layout.tsx에서 로드된다.
// 이벤트: test_start, test_complete, share_kakao, share_link, save_image, retake, try_from_share
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', event, params)
}
