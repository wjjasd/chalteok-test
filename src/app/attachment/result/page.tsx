'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAttachmentStore } from '@/store/attachment'
import {
  calcAttachmentResult,
  encodeAttachmentShare,
  decodeAttachmentShare,
  TYPE_CONFIG,
  AttachmentResult,
  AttachmentType,
} from '@/lib/attachmentScoring'
import { loadKakaoSdk, initKakao } from '@/lib/kakaoSdk'

const AttachmentChart = dynamic(() => import('./AttachmentChart'), { ssr: false })

function AttachmentResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const r = searchParams.get('r')
  const storeAnswers = useAttachmentStore((s) => s.answers)
  const termsAgreed = useAttachmentStore((s) => s.termsAgreed)

  const [result, setResult] = useState<AttachmentResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [kakaoLoading, setKakaoLoading] = useState(false)

  useEffect(() => {
    loadKakaoSdk().then(initKakao).catch(() => {})
  }, [])

  useEffect(() => {
    setResult(null)

    if (r) {
      const decoded = decodeAttachmentShare(r)
      if (decoded) {
        const { anxietyScore, avoidanceScore } = decoded
        let type: AttachmentType
        if (anxietyScore === 18 && avoidanceScore === 18) type = 'mirror-sea'
        else if (anxietyScore > 18 && avoidanceScore > 18) type = 'stormy-sea'
        else if (anxietyScore > 18) type = 'wavy-sea'
        else if (avoidanceScore > 18) type = 'lone-island'
        else type = 'calm-sea'
        setResult({ ...decoded, type })
        return
      }
    }

    if (!termsAgreed) {
      router.replace('/attachment')
      return
    }

    const r2 = calcAttachmentResult(storeAnswers)
    setResult(r2)
  }, [r])

  const handleShare = () => {
    if (!result) return
    const encoded = encodeAttachmentShare(result.anxietyScore, result.avoidanceScore)
    const url = `${window.location.origin}/attachment/result?r=${encoded}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleKakaoShare = async () => {
    if (!result) return
    setKakaoLoading(true)
    try {
      await loadKakaoSdk()
      initKakao()
    } catch {
      alert('카카오 SDK를 불러올 수 없습니다.\n광고 차단기가 활성화된 경우 비활성화 후 재시도하거나, 🔗 URL 공유를 이용해 주세요.')
      setKakaoLoading(false)
      return
    }
    if (!window.Kakao) { setKakaoLoading(false); return }
    const config = TYPE_CONFIG[result.type]
    const encoded = encodeAttachmentShare(result.anxietyScore, result.avoidanceScore)
    const shareUrl = `${window.location.origin}/attachment/result?r=${encoded}`
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `나는 ${config.name} ${config.emoji}`,
        description: `${config.tagline} — 찰떡 애착유형 테스트`,
        imageUrl: `${window.location.origin}/api/og/attachment?type=${result.type}`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
    })
    setKakaoLoading(false)
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        결과를 계산하고 있습니다...
      </div>
    )
  }

  const config = TYPE_CONFIG[result.type]

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white pb-16">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-5">
        {/* 헤더 */}
        <div className="text-center">
          <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            애착유형 결과
          </span>
          <h1 className="text-2xl font-bold text-gray-900">나의 관계 패턴</h1>
        </div>

        {/* 유형 카드 */}
        <div className={`rounded-2xl border p-6 ${config.bg} ${config.borderColor}`}>
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">{config.emoji}</div>
            <h2 className={`text-2xl font-bold mb-1 ${config.color}`}>{config.name}</h2>
            <p className="text-sm text-gray-500">{config.tagline}</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* 2축 산점도 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-1">불안 · 회피 축 분포</h2>
          <p className="text-xs text-gray-400 mb-4">각 축 18점 초과이면 해당 경향이 높은 것으로 봅니다</p>
          <AttachmentChart anxietyScore={result.anxietyScore} avoidanceScore={result.avoidanceScore} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-gray-50 rounded-xl py-3">
              <div className="text-xs text-gray-400 mb-1">불안 점수</div>
              <div className="font-bold text-gray-800 text-lg">{result.anxietyScore}<span className="text-xs text-gray-400 ml-0.5">/ 30</span></div>
            </div>
            <div className="bg-gray-50 rounded-xl py-3">
              <div className="text-xs text-gray-400 mb-1">회피 점수</div>
              <div className="font-bold text-gray-800 text-lg">{result.avoidanceScore}<span className="text-xs text-gray-400 ml-0.5">/ 30</span></div>
            </div>
          </div>
        </div>

        {/* 유형 설명 그리드 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">5가지 관계 패턴</h2>
          <div className="grid grid-cols-2 gap-2">
            {(['calm-sea', 'wavy-sea', 'lone-island', 'stormy-sea'] as AttachmentType[]).map((key) => {
              const cfg = TYPE_CONFIG[key]
              return (
                <div
                  key={key}
                  className={`rounded-xl p-3 border text-sm ${
                    key === result.type
                      ? `${cfg.bg} ${cfg.borderColor} font-semibold`
                      : 'bg-gray-50 border-gray-100 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span>{cfg.emoji}</span>
                    <span className={key === result.type ? cfg.color : 'text-gray-600'}>{cfg.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-tight">{cfg.tagline}</p>
                </div>
              )
            })}
            <div
              className={`col-span-2 rounded-xl p-3 border text-sm ${
                result.type === 'mirror-sea'
                  ? `${TYPE_CONFIG['mirror-sea'].bg} ${TYPE_CONFIG['mirror-sea'].borderColor} font-semibold`
                  : 'bg-gray-50 border-gray-100 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span>{TYPE_CONFIG['mirror-sea'].emoji}</span>
                <span className={result.type === 'mirror-sea' ? TYPE_CONFIG['mirror-sea'].color : 'text-gray-600'}>
                  {TYPE_CONFIG['mirror-sea'].name}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-tight">{TYPE_CONFIG['mirror-sea'].tagline}</p>
            </div>
          </div>
        </div>

        {/* 면책 가이드 */}
        <div className="bg-gray-100 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed">
          <p>
            이 결과는 자기 이해를 위한 성찰 도구이며, 진단이 아닙니다.
            애착 패턴은 경험과 환경에 따라 변할 수 있으며, 어떤 유형도 좋거나 나쁘지 않습니다.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            애착유형 테스트는 자기 이해를 위한 성찰 도구이며, 진단이 아닙니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleKakaoShare}
            disabled={kakaoLoading}
            className="col-span-2 py-3.5 rounded-2xl font-semibold text-sm transition-colors"
            style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
          >
            {kakaoLoading
              ? <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : '💬 카카오톡 공유'}
          </button>
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl font-semibold border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors text-sm"
          >
            {copied ? '복사됨!' : '🔗 URL 공유'}
          </button>
          <button
            onClick={() => {
              useAttachmentStore.getState().reset()
              router.push('/attachment')
            }}
            className="py-3.5 rounded-2xl font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            다시 시작
          </button>
          <button
            onClick={() => router.push('/')}
            className="col-span-2 py-3.5 rounded-2xl font-semibold border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            다른 테스트 보기
          </button>
        </div>
      </div>
    </main>
  )
}

export default function AttachmentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        결과를 계산하고 있습니다...
      </div>
    }>
      <AttachmentResultContent />
    </Suspense>
  )
}
