'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useRFIStore } from '@/store/rfi'
import { calcResult, GRADE_CONFIG, ScoreResult } from '@/lib/scoring'
import { SectionId, SECTIONS, CUTOFF_QUESTIONS } from '@/lib/questions'
import { encodeShare, decodeShare, SharePayload } from '@/lib/share'
import ScoreGauge from '@/components/ScoreGauge'

const RadarChart = dynamic(() => import('@/components/RadarChart'), { ssr: false })

const SECTION_TITLES: Record<SectionId, string> = {
  A: '초기 끌림',
  B: '대화 적합도',
  C: '감정적 안정성',
  D: '가치관',
  E: '생활 적합도',
  F: '신뢰',
  G: '관계 흐름',
  H: '자기 상태 변화',
}

const CUTOFF_BADGE = {
  0: null,
  1: { text: '⚠️ 주의', bg: 'bg-yellow-100', border: 'border-yellow-300', text_color: 'text-yellow-800' },
  2: { text: '🔴 위험', bg: 'bg-red-100', border: 'border-red-300', text_color: 'text-red-800' },
}

function getCutoffBadge(count: number) {
  if (count === 0) return null
  if (count === 1) return CUTOFF_BADGE[1]
  return CUTOFF_BADGE[2]
}

export default function ResultPage() {
  const router = useRouter()
  const storeAnswers = useRFIStore((s) => s.answers)
  const storeWeights = useRFIStore((s) => s.weights)
  const storeStage = useRFIStore((s) => s.profile.relationshipStage)

  const captureRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [weights, setWeights] = useState<Record<SectionId, number>>(storeWeights)
  const [cutoffYesIds, setCutoffYesIds] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (key && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(key)
    }
  }, [])

  useEffect(() => {
    // URL Fragment 공유 복원 체크
    if (typeof window !== 'undefined' && window.location.hash) {
      const shared: SharePayload | null = decodeShare(window.location.hash)
      if (shared) {
        setResult({
          sectionPercents: shared.sectionPercents,
          finalScore: shared.finalScore,
          grade: shared.grade,
          activeSections: shared.activeSections,
          cutoffCount: shared.cutoffCount,
        })
        setWeights(shared.weights)
        setCutoffYesIds(shared.cutoffYesIds ?? [])
        return
      }
    }

    // 스토어 기반 계산
    if (!storeStage) {
      router.replace('/')
      return
    }
    const r = calcResult(storeAnswers, storeWeights, storeStage)
    setResult(r)
    setWeights(storeWeights)
    setCutoffYesIds([41, 42, 43, 44, 45].filter((id) => storeAnswers[`Q${id}`] === true))
  }, [])

  const handleKakaoShare = async () => {
    if (!result) return
    if (!window.Kakao) {
      try {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://developers.kakao.com/sdk/js/kakao.js'
          s.onload = () => resolve()
          s.onerror = () => reject()
          document.head.appendChild(s)
        })
      } catch {
        alert('카카오 SDK를 불러올 수 없습니다.\n광고 차단기가 활성화된 경우 비활성화 후 재시도하거나, 🔗 URL 공유를 이용해 주세요.')
        return
      }
    }
    if (!window.Kakao) return
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (key && !window.Kakao.isInitialized()) {
      window.Kakao.init(key)
    }
    const payload: SharePayload = {
      sectionPercents: result.sectionPercents,
      weights,
      finalScore: result.finalScore,
      grade: result.grade,
      cutoffCount: result.cutoffCount,
      cutoffYesIds,
      activeSections: result.activeSections,
    }
    const url = `${window.location.origin}/result#${encodeShare(payload)}`
    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: `내 관계 적합도 점수는 ${Math.round(result.finalScore)}점 (${result.grade}등급)입니다.\nRFI는 자기 성찰 도구이며, 관계 진단이 아닙니다.`,
      link: { mobileWebUrl: url, webUrl: url },
    })
  }

  const handleDownload = () => {
    if (!result) return
    setCapturing(true)
    try {
      const W = 600
      const P = 36
      const sections = [...result.activeSections].sort((a, b) => weights[b] - weights[a])
      const totalH = P + 28 + 8 + 28 + 16 + 80 + 8 + 44 + 16 + 1 + 16 + 24 + sections.length * 44 + 16 + 20 + P

      const dpr = Math.min(window.devicePixelRatio || 2, 3)
      const canvas = document.createElement('canvas')
      canvas.width = W * dpr
      canvas.height = totalH * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, totalH)

      let y = P

      // 배지
      ctx.font = 'bold 11px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const badgeW = ctx.measureText('궁합 점수').width + 24
      ctx.fillStyle = '#ffe4e6'
      ctx.beginPath()
      ctx.roundRect((W - badgeW) / 2, y, badgeW, 22, 11)
      ctx.fill()
      ctx.fillStyle = '#e11d48'
      ctx.fillText('궁합 점수', W / 2, y + 11)
      y += 30

      // 제목
      ctx.fillStyle = '#111827'
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('상대방과 나의 적합도', W / 2, y + 10)
      y += 32

      // 점수
      ctx.font = 'bold 72px system-ui, sans-serif'
      ctx.fillText(`${Math.round(result.finalScore)}점`, W / 2, y + 56)
      y += 80

      // 등급 pill
      const GRADE_COLORS: Record<string, { bg: string; fg: string }> = {
        S: { bg: '#dcfce7', fg: '#14532d' },
        A: { bg: '#dbeafe', fg: '#1e3a8a' },
        B: { bg: '#fef9c3', fg: '#713f12' },
        C: { bg: '#ffedd5', fg: '#7c2d12' },
        D: { bg: '#fee2e2', fg: '#7f1d1d' },
      }
      const gc = GRADE_COLORS[result.grade] ?? { bg: '#f3f4f6', fg: '#111827' }
      const gradeLabel = GRADE_CONFIG[result.grade]?.label ?? ''
      const gradeText = `${result.grade}등급 — ${gradeLabel}`
      ctx.font = 'bold 15px system-ui, sans-serif'
      const gradeW = ctx.measureText(gradeText).width + 32
      ctx.fillStyle = gc.bg
      ctx.beginPath()
      ctx.roundRect((W - gradeW) / 2, y, gradeW, 36, 10)
      ctx.fill()
      ctx.fillStyle = gc.fg
      ctx.fillText(gradeText, W / 2, y + 18)
      y += 52

      // 구분선
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(P, y, W - P * 2, 1)
      y += 16

      // 섹션 헤더
      ctx.fillStyle = '#374151'
      ctx.font = 'bold 13px system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('영역별 점수', P, y + 8)
      y += 24

      // 섹션 바
      for (const id of sections) {
        const pct = Math.round(result.sectionPercents[id])
        const barColor = pct >= 70 ? '#4ade80' : pct >= 50 ? '#facc15' : '#f87171'
        const barMaxW = W - P * 2

        ctx.fillStyle = '#374151'
        ctx.font = '13px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`${id}. ${SECTION_TITLES[id]}`, P, y + 8)

        ctx.fillStyle = '#111827'
        ctx.font = 'bold 13px system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(`${pct}%`, W - P, y + 8)

        y += 20
        ctx.fillStyle = '#e5e7eb'
        ctx.beginPath()
        ctx.roundRect(P, y, barMaxW, 10, 5)
        ctx.fill()

        const fillW = barMaxW * pct / 100
        if (fillW > 0) {
          ctx.fillStyle = barColor
          ctx.beginPath()
          ctx.roundRect(P, y, Math.max(fillW, 8), 10, 5)
          ctx.fill()
        }
        y += 24
      }

      // 면책 문구
      y += 16
      ctx.fillStyle = '#9ca3af'
      ctx.font = '11px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('RFI는 자기 성찰 도구이며, 관계 진단이 아닙니다.', W / 2, y + 8)

      const link = document.createElement('a')
      link.download = `RFI_결과_${Math.round(result.finalScore)}점.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setCapturing(false)
    }
  }

  const handleShare = () => {
    if (!result) return
    const payload: SharePayload = {
      sectionPercents: result.sectionPercents,
      weights,
      finalScore: result.finalScore,
      grade: result.grade,
      cutoffCount: result.cutoffCount,
      cutoffYesIds,
      activeSections: result.activeSections,
    }
    const hash = encodeShare(payload)
    const url = `${window.location.origin}/result#${hash}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        결과를 계산하고 있습니다...
      </div>
    )
  }

  const gradeConfig = GRADE_CONFIG[result.grade]
  const cutoffBadge = getCutoffBadge(result.cutoffCount)
  const isSevere = result.cutoffCount >= 3

  // 가중치 높은 순으로 섹션 정렬
  const sortedSections = [...result.activeSections].sort(
    (a, b) => weights[b] - weights[a],
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div ref={captureRef} className="max-w-lg mx-auto px-4 pt-8 space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <span className="inline-block bg-rose-100 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            궁합 점수
          </span>
          <h1 className="text-2xl font-bold text-gray-900">상대방과 나의 적합도</h1>
        </div>

        {/* 컷오프 심각 경고 */}
        {isSevere && (
          <div className="bg-red-50 border border-red-300 rounded-2xl p-4">
            <p className="text-red-700 font-semibold text-sm">
              🚨 강한 재검토 권고
            </p>
            <p className="text-red-600 text-sm mt-1">
              중요한 경고 신호가 {result.cutoffCount}개 감지되었습니다. 신뢰할 수 있는 주변인 또는 전문 상담사와 상의하시기 바랍니다.
            </p>
          </div>
        )}

        {/* 점수 게이지 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <ScoreGauge score={result.finalScore} />
          <div className="mt-4 text-center">
            <span className={`inline-block px-4 py-2 rounded-xl font-bold text-lg ${gradeConfig.bg} ${gradeConfig.color}`}>
              등급 {result.grade} — {gradeConfig.label}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
            {gradeConfig.description}
          </p>
        </div>

        {/* 컷오프 배지 */}
        {cutoffBadge && !isSevere && (
          <div className={`rounded-2xl border p-4 ${cutoffBadge.bg} ${cutoffBadge.border}`}>
            <p className={`font-semibold text-sm ${cutoffBadge.text_color}`}>{cutoffBadge.text}</p>
            <p className={`text-sm mt-1 ${cutoffBadge.text_color}`}>
              중요한 경고 항목이 {result.cutoffCount}개 확인되었습니다.
            </p>
            <div className="mt-2 space-y-1">
              {CUTOFF_QUESTIONS.map((q) => {
                if (!cutoffYesIds.includes(q.id)) return null
                return (
                  <p key={q.id} className={`text-xs ${cutoffBadge.text_color}`}>
                    · {q.text}
                  </p>
                )
              })}
            </div>
          </div>
        )}

        {/* 레이더 차트 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">영역별 분포</h2>
          <RadarChart
            sectionPercents={result.sectionPercents}
            activeSections={result.activeSections}
          />
        </div>

        {/* 섹션별 바 차트 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">영역별 점수</h2>
          <div className="space-y-3">
            {sortedSections.map((id) => {
              const pct = Math.round(result.sectionPercents[id])
              const barColor =
                pct >= 70 ? 'bg-green-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              return (
                <div key={id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">
                      {id}. {SECTION_TITLES[id]}
                    </span>
                    <span className="font-semibold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 해석 가이드 */}
        <div className="bg-gray-100 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed">
          <p>
            이 결과는 전문적인 관계 진단이 아닌, 자기 성찰을 위한 참고 자료입니다.
            관계에 대한 중요한 결정은 신뢰할 수 있는 주변인 또는 전문 상담사와 상의하시기 바랍니다.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            RFI는 자기 성찰 도구이며, 관계 진단이 아닙니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl font-semibold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors text-sm"
          >
            {copied ? '복사됨!' : '🔗 URL 공유'}
          </button>
          <button
            onClick={handleKakaoShare}
            className="py-3.5 rounded-2xl font-semibold border border-yellow-300 text-yellow-800 bg-yellow-50 hover:bg-yellow-100 transition-colors text-sm"
          >
            💬 카카오 공유
          </button>
          <button
            onClick={handleDownload}
            disabled={capturing}
            className="py-3.5 rounded-2xl font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            {capturing ? '저장 중...' : '📷 이미지 저장'}
          </button>
          <button
            onClick={() => {
              useRFIStore.getState().reset()
              router.push('/')
            }}
            className="py-3.5 rounded-2xl font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            다시 시작
          </button>
        </div>
      </div>
    </div>
  )
}
