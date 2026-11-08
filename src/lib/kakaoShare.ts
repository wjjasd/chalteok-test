import { loadKakaoSdk, initKakao } from './kakaoSdk'

export interface KakaoShareContent {
  title: string
  description: string
  imageUrl: string
  url: string
}

/** 카카오톡 공유 창을 띄우면 true, SDK를 못 쓰는 환경(차단기·키 누락·로드 실패)이면 false */
export async function shareToKakao({ title, description, imageUrl, url }: KakaoShareContent): Promise<boolean> {
  try {
    await loadKakaoSdk()
    initKakao()
  } catch {
    return false
  }
  if (!window.Kakao?.Share || !window.Kakao.isInitialized()) return false
  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl,
        link: { mobileWebUrl: url, webUrl: url },
      },
    })
    return true
  } catch {
    return false
  }
}
