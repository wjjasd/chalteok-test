'use client'

import { useEffect } from 'react'
import { preloadKakaoSdk } from '@/lib/kakaoSdk'

// 테스트 layout에 두어 진입 즉시 SDK를 받아둔다 — 결과 화면에서 공유를 누를 때 로드 대기가 없도록
export default function KakaoSdkPreload() {
  useEffect(() => {
    preloadKakaoSdk()
  }, [])
  return null
}
