let sdkPromise: Promise<void> | null = null

export function loadKakaoSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Kakao) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://developers.kakao.com/sdk/js/kakao.js'
    s.onload = () => resolve()
    s.onerror = () => {
      sdkPromise = null
      reject(new Error('kakao sdk load failed'))
    }
    document.head.appendChild(s)
  })
  return sdkPromise
}

export function initKakao() {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
  if (key && window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(key)
  }
}
