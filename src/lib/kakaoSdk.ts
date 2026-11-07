// 버전·해시는 https://developers.kakao.com/docs/latest/ko/javascript/download 공식 값. 버전 올릴 때 둘 다 함께 교체
export const KAKAO_SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.4/kakao.min.js'
export const KAKAO_SDK_INTEGRITY = 'sha384-BGX7Wb16GmRFagri4bLJV2DgipVZaU2AI812GZtHtHzzDQJnfHasDXN5houxv45w'

let sdkPromise: Promise<void> | null = null

export function loadKakaoSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Kakao) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = KAKAO_SDK_SRC
    s.integrity = KAKAO_SDK_INTEGRITY
    s.crossOrigin = 'anonymous'
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
