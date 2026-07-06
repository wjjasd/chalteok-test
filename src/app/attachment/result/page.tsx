'use client'

import { Suspense, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
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

const BASE_URL = 'https://chalteok.com'

const TYPE_HEX: Record<AttachmentType, { bg: string; text: string; border: string }> = {
  'calm-sea':    { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
  'wavy-sea':    { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'lone-island': { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  'stormy-sea':  { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
  'mirror-sea':  { bg: '#f8fafc', text: '#334155', border: '#e2e8f0' },
}

function AttachmentResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const r = searchParams.get('r')
  const storeAnswers = useAttachmentStore((s) => s.answers)
  const termsAgreed = useAttachmentStore((s) => s.termsAgreed)

  const [result, setResult] = useState<AttachmentResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [kakaoLoading, setKakaoLoading] = useState(false)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    loadKakaoSdk().then(initKakao).catch(() => {})
  }, [])

  useEffect(() => {
    setResult(null)

    const hasStoreAnswers = Object.keys(storeAnswers).length > 0

    // 스토어에 답변이 있으면 quiz를 직접 완료한 것 → URL 파라미터 무시하고 스토어 우선
    // (공유 링크 접속 후 다시하기 → quiz 완료 시 이전 ?r= 파라미터가 URL에 남는 Next.js 라우팅 버그 방어)
    if (r && !hasStoreAnswers) {
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
    const url = `${BASE_URL}/attachment/result?r=${encoded}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleKakaoShare = async () => {
    if (!result) return
    flushSync(() => setKakaoLoading(true))
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
    const shareUrl = `${BASE_URL}/attachment/result?r=${encoded}`
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `나는 ${config.name} ${config.emoji}`,
        description: `${config.tagline} — 찰떡 애착유형 테스트`,
        imageUrl: `${BASE_URL}/api/og/attachment?type=${result.type}`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
    })
    setKakaoLoading(false)
  }

  const handleDownload = () => {
    if (!result) return
    const safeResult = result
    setCapturing(true)
    try {
      const W = 600
      const P = 40
      const dpr = Math.min(window.devicePixelRatio || 2, 3)
      const tc = TYPE_HEX[safeResult.type]
      const typeConfig = TYPE_CONFIG[safeResult.type]

      function drawAll(ctx: CanvasRenderingContext2D, totalH: number): number {
        ctx.textBaseline = 'middle'

        // 전체 배경
        ctx.fillStyle = tc.bg
        ctx.fillRect(0, 0, W, totalH)

        let y = 40

        // 1. 브랜드 태그
        ctx.font = '12px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = tc.text
        ctx.fillText('찰떡 애착유형 테스트', W / 2, y)

        y += 56

        // 2. 이모지
        ctx.font = '72px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#000000'
        ctx.fillText(typeConfig.emoji, W / 2, y)

        y += 60

        // 3. 유형명
        ctx.font = 'bold 40px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = tc.text
        ctx.fillText(typeConfig.name, W / 2, y)

        y += 40

        // 4. tagline
        ctx.font = '16px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#6b7280'
        ctx.fillText(typeConfig.tagline, W / 2, y)

        y += 22

        // 4-1. 한줄 설명 (description 첫 문장)
        const firstSentence = typeConfig.description.split('어요.')[0] + '어요.'
        ctx.font = '13px system-ui, sans-serif'
        ctx.fillStyle = '#9ca3af'
        ctx.textAlign = 'center'
        const descMaxW = W - P * 2
        let descLine = ''
        const descLines: string[] = []
        for (const ch of firstSentence) {
          const test = descLine + ch
          if (ctx.measureText(test).width > descMaxW && descLine) {
            descLines.push(descLine)
            descLine = ch
          } else {
            descLine = test
          }
        }
        if (descLine) descLines.push(descLine)
        descLines.forEach((l, i) => ctx.fillText(l, W / 2, y + i * 18))
        y += descLines.length * 18 + 20

        // 5. 구분선
        ctx.globalAlpha = 0.2
        ctx.strokeStyle = tc.text
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(P, y)
        ctx.lineTo(W - P, y)
        ctx.stroke()
        ctx.globalAlpha = 1.0

        y += 44

        // 6. 점수 두 개 (가로 나란히)
        const halfW = (W - P * 2) / 2
        const leftCX = P + halfW / 2
        const rightCX = P + halfW + halfW / 2
        const anxStr = String(safeResult.anxietyScore)
        const avoStr = String(safeResult.avoidanceScore)
        const subText = '/30'

        // 레이블 행
        ctx.font = '12px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#6b7280'
        ctx.fillText('불안', leftCX, y)
        ctx.fillText('회피', rightCX, y)

        y += 32

        // 점수 폭 측정
        ctx.font = 'bold 32px system-ui, sans-serif'
        const anxW = ctx.measureText(anxStr).width
        const avoW = ctx.measureText(avoStr).width
        ctx.font = '14px system-ui, sans-serif'
        const subW = ctx.measureText(subText).width

        const startX1 = leftCX - (anxW + 6 + subW) / 2
        const startX2 = rightCX - (avoW + 6 + subW) / 2

        // 불안 점수
        ctx.font = 'bold 32px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = tc.text
        ctx.fillText(anxStr, startX1, y)
        ctx.font = '14px system-ui, sans-serif'
        ctx.fillStyle = '#9ca3af'
        ctx.fillText(subText, startX1 + anxW + 6, y)

        // 회피 점수
        ctx.font = 'bold 32px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = tc.text
        ctx.fillText(avoStr, startX2, y)
        ctx.font = '14px system-ui, sans-serif'
        ctx.fillStyle = '#9ca3af'
        ctx.fillText(subText, startX2 + avoW + 6, y)

        y += 52

        // 7. 산점도 격자
        const gridSize = 220
        const gridX = (W - gridSize) / 2
        const gridY = y

        // 격자 외곽선
        ctx.strokeStyle = tc.text
        ctx.globalAlpha = 0.5
        ctx.lineWidth = 1.5
        ctx.strokeRect(gridX, gridY, gridSize, gridSize)
        ctx.globalAlpha = 1.0

        // 분기선 — 시각적으로 정중앙 4등분
        const threshX = gridX + gridSize / 2
        const threshY = gridY + gridSize / 2

        ctx.strokeStyle = tc.text
        ctx.globalAlpha = 0.5
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 4])
        ctx.beginPath()
        ctx.moveTo(threshX, gridY)
        ctx.lineTo(threshX, gridY + gridSize)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(gridX, threshY)
        ctx.lineTo(gridX + gridSize, threshY)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1.0

        // 분면 레이블 — 각 사분면 바깥쪽 모서리(dot과 겹침 방지)
        const pad = 8
        ctx.font = '11px system-ui, sans-serif'
        ctx.fillStyle = tc.text
        ctx.globalAlpha = 0.7
        ctx.textAlign = 'left'
        ctx.fillText('나만의 섬형', gridX + pad, gridY + 14)
        ctx.fillText('고요한 바다형', gridX + pad, gridY + gridSize - pad)
        ctx.textAlign = 'right'
        ctx.fillText('폭풍 속 바다형', gridX + gridSize - pad, gridY + 14)
        ctx.fillText('파도치는 바다형', gridX + gridSize - pad, gridY + gridSize - pad)
        ctx.globalAlpha = 1.0

        // 현재 위치 마커 (점수 범위 6~30을 화면 차트와 동일한 도메인으로 매핑)
        const dotX = gridX + ((safeResult.anxietyScore - 6) / 24) * gridSize
        const dotY = gridY + (1 - (safeResult.avoidanceScore - 6) / 24) * gridSize

        ctx.fillStyle = tc.text
        ctx.beginPath()
        ctx.arc(dotX, dotY, 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(dotX, dotY, 10, 0, Math.PI * 2)
        ctx.stroke()

        y += gridSize + 48

        // 8. 하단 브랜딩
        ctx.font = '14px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = tc.text
        ctx.fillText('chalteok.com', W / 2, y)

        y += P

        return y
      }

      const LARGE_H = 4000
      const measureCanvas = document.createElement('canvas')
      measureCanvas.width = W * dpr
      measureCanvas.height = LARGE_H * dpr
      const mctx = measureCanvas.getContext('2d')!
      mctx.scale(dpr, dpr)
      const measuredH = drawAll(mctx, LARGE_H)

      const canvas = document.createElement('canvas')
      canvas.width = W * dpr
      canvas.height = measuredH * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)
      drawAll(ctx, measuredH)

      const link = document.createElement('a')
      link.download = `찰떡_애착유형_${typeConfig.name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setCapturing(false)
    }
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
          <button
            onClick={handleKakaoShare}
            disabled={kakaoLoading}
            className="mt-4 w-full py-3.5 rounded-2xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
          >
            {kakaoLoading
              ? <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : '💬 카카오톡 공유'}
          </button>
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
            애착 패턴은 경험과 환경에 따라 얼마든지 달라질 수 있어요. 어떤 유형도 좋거나 나쁘지 않아요.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl font-semibold border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors text-sm"
          >
            {copied ? '복사됨!' : '🔗 URL 공유'}
          </button>
          <button
            onClick={handleDownload}
            disabled={capturing}
            className="py-3.5 rounded-2xl font-semibold border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors text-sm disabled:opacity-50"
          >
            {capturing ? '저장 중...' : '📷 이미지 저장'}
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
            className="col-span-3 py-3.5 rounded-2xl font-semibold border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors text-sm"
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
