'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useQuizStore } from '@/store/quiz'
import { calcResult, GRADE_CONFIG, ScoreResult } from '@/lib/scoring'
import { SectionId, CUTOFF_QUESTIONS } from '@/lib/questions'
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

// [0]=≥85, [1]=≥70, [2]=≥55, [3]=≥40, [4]<40
const SECTION_COMMENTS: Record<SectionId, [string, string, string, string, string]> = {
  A: [
    '강한 끌림과 설렘이 두 분 사이에 뚜렷하게 느껴지는 상태예요. 신체적·감정적 매력이 잘 형성되어 있어 관계의 동력이 되고 있어요.',
    '서로에 대한 끌림이 충분히 있고, 함께할 때 편안함과 설렘이 공존해요. 자연스럽게 가까워지고 있는 단계예요.',
    '끌림을 느끼는 부분도 있지만 아직 어색하거나 거리감이 있는 순간도 있어요. 더 많은 시간을 함께하면서 자연스럽게 발전할 수 있어요.',
    '현재 신체적 또는 감정적 끌림이 충분히 형성되지 않은 상태예요. 억지로 맞추기보다 솔직한 감정을 확인해보는 것이 좋아요.',
    '상대방에 대한 끌림이나 설렘이 거의 느껴지지 않는 상태예요. 관계를 지속할 동기에 대해 솔직하게 점검해볼 필요가 있어요.',
  ],
  B: [
    '대화가 편안하고 자연스럽게 흘러요. 서로의 말을 잘 듣고 반응하며, 감정과 생각을 주고받는 데 막힘이 없는 관계예요.',
    '소통이 잘 되고 대화할 때 대체로 편안함을 느껴요. 가끔 답답한 순간이 있어도 대화로 풀어낼 수 있는 관계예요.',
    '소통은 되지만 이따금 말이 잘 통하지 않거나 감정 전달이 어려운 순간이 있어요. 대화 방식에 대해 솔직하게 이야기 나눠보면 도움이 돼요.',
    '대화 중 단절감이나 답답함을 자주 느끼는 편이에요. 서로의 소통 방식이 달라 오해나 감정적 거리가 생길 수 있어요.',
    '의사소통에서 불편함이 많이 느껴지는 상태예요. 말이 잘 통하지 않거나 감정이 전달되지 않는다는 느낌이 잦다면 관계의 기초를 점검해볼 필요가 있어요.',
  ],
  C: [
    '감정적으로 안정적인 관계예요. 갈등 상황에서도 서로를 배려하며 대화가 잘 이루어지고, 감정 기복이 관계를 흔들지 않아요.',
    '대체로 감정이 안정적으로 유지돼요. 때로 감정 조율이 필요한 순간이 있지만, 서로 이해하려는 노력이 느껴지는 관계예요.',
    '감정 처리 방식에서 간혹 충돌이 생기거나 상대방의 반응이 이해되지 않을 때가 있어요. 서로의 감정 표현 방식에 대해 더 깊이 이야기해보면 좋아요.',
    '감정 기복이나 갈등 대처 방식에서 불편함을 자주 느끼는 편이에요. 감정적으로 소진되거나 불안정하다면 서로의 패턴을 인식하고 조율하는 것이 중요해요.',
    '감정적인 안정감이 많이 부족한 상태예요. 갈등 시 감정이 크게 상하거나 회복이 어렵다면, 두 분의 감정 패턴에 대해 신중하게 살펴볼 필요가 있어요.',
  ],
  D: [
    '돈, 결혼, 삶의 방향 등 핵심 가치관이 잘 맞아요. 서로 중요하게 여기는 것이 비슷해서 큰 결정에서도 충돌이 적을 거예요.',
    '주요 가치관이 대체로 맞는 편이에요. 일부 생각 차이가 있더라도 서로 이해하고 존중하는 자세가 있어 함께 조율해나갈 수 있어요.',
    '가치관이 맞는 부분도 있지만, 중요한 주제(돈, 미래, 삶의 우선순위 등)에서 생각이 다를 때가 있어요. 미리 충분히 대화해두는 게 좋아요.',
    '핵심 가치관에서 차이가 꽤 있는 편이에요. 지금은 괜찮아 보여도 관계가 깊어질수록 이 차이가 갈등으로 이어질 수 있어요.',
    '삶을 바라보는 방식이나 중요하게 여기는 것에서 큰 차이가 있어요. 이런 가치관 충돌은 장기적인 관계에서 큰 어려움이 될 수 있어요.',
  ],
  E: [
    '생활 리듬, 청결, 소비 습관 등이 잘 맞아 함께 지내기 매우 편안해요. 일상의 마찰이 적고 서로의 생활 방식을 자연스럽게 받아들이고 있어요.',
    '생활 습관이 대체로 잘 맞는 편이에요. 다소 다른 부분도 있지만 서로 배려하며 잘 적응하고 있어요.',
    '생활 방식에서 차이가 느껴지지만 크게 불편하지는 않은 상태예요. 함께 지내는 시간이 늘어날수록 조율이 더 필요해질 수 있어요.',
    '일상 습관이나 생활 리듬에서 차이가 꽤 있어요. 이런 차이는 함께 지내다 보면 반복적인 스트레스로 이어질 수 있어 주의가 필요해요.',
    '생활 습관과 방식이 맞지 않는 부분이 많아요. 장기적으로 함께 지낼 때 마찰이 잦을 수 있으니 솔직하게 이야기 나눠보는 것이 필요해요.',
  ],
  F: [
    '말과 행동이 일치하고 신뢰가 깊이 형성된 관계예요. 상대방이 믿을 만하다는 확신이 있고, 그 신뢰가 관계의 기반이 되고 있어요.',
    '신뢰가 잘 형성되어 있어요. 작은 불일치가 있을 때도 서로에 대한 믿음이 바탕이 되어 관계를 안정적으로 유지할 수 있어요.',
    '신뢰는 있지만 약속이나 솔직함에서 아쉬운 순간이 가끔 있어요. 작은 신뢰 균열이 쌓이지 않도록 꾸준한 소통이 중요해요.',
    '신뢰 형성에 어려움이 있거나, 말과 행동이 일치하지 않는 경우가 종종 느껴지는 편이에요. 신뢰 문제는 관계에서 중요한 신호이므로 진지하게 점검해보세요.',
    '상대방을 믿기 어렵다는 감각이 자주 드는 상태예요. 신뢰의 부재는 관계 전반에 영향을 미치므로, 근본적인 원인을 살펴보는 것이 중요해요.',
  ],
  G: [
    '갈등 후 회복이 빠르고 관계가 꾸준히 성장하고 있어요. 다툼이 있어도 서로 이해하고 더 나은 방향으로 발전하는 힘이 있는 관계예요.',
    '갈등 후 대체로 잘 회복되고 관계가 앞으로 나아가고 있어요. 반복되는 패턴이 있다면 근본 원인을 짚어보는 것도 좋아요.',
    '갈등 회복은 되지만 완전히 해소되지 않은 감정이 남는 경우가 있어요. 같은 문제가 반복된다면 대화 방식을 바꿔볼 필요가 있어요.',
    '갈등 후 회복이 느리거나 비슷한 문제가 반복되는 편이에요. 해결되지 않은 채 쌓이는 갈등은 관계에 점점 부담이 될 수 있어요.',
    '갈등이 제대로 해결되지 않거나, 회복 없이 반복되는 상태예요. 이런 패턴이 지속된다면 관계 방식 전반을 재점검할 필요가 있어요.',
  ],
  H: [
    '이 관계에서 자존감이 유지되고 자신답게 있을 수 있어요. 상대방이 당신의 모습 그대로를 받아들이고, 함께할수록 에너지가 채워지는 느낌이에요.',
    '대체로 자신답게 있을 수 있고 관계에서 긍정적인 에너지를 얻고 있어요. 가끔 지치거나 맞춰야 한다는 느낌이 들 수 있지만 전반적으로 건강한 편이에요.',
    '이 관계에서 자신을 잃는 느낌이 드는 때가 있어요. 상대에게 맞추느라 본래의 자신이 줄어드는 것 같다면 경계를 점검해볼 필요가 있어요.',
    '이 관계에서 에너지가 소진되거나 자존감이 낮아지는 느낌이 드는 편이에요. 이런 감각이 지속된다면 관계 패턴을 솔직하게 들여다봐야 해요.',
    '이 관계에서 자신을 많이 잃고 있거나 정서적으로 많이 지쳐 있는 상태예요. 관계가 당신에게 미치는 영향을 신뢰할 수 있는 사람과 함께 이야기해보세요.',
  ],
}

function getSectionComment(pct: number, id: SectionId): string {
  if (pct >= 85) return SECTION_COMMENTS[id][0]
  if (pct >= 70) return SECTION_COMMENTS[id][1]
  if (pct >= 55) return SECTION_COMMENTS[id][2]
  if (pct >= 40) return SECTION_COMMENTS[id][3]
  return SECTION_COMMENTS[id][4]
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

export default function ResultClient() {
  const router = useRouter()
  const storeAnswers = useQuizStore((s) => s.answers)
  const storeWeights = useQuizStore((s) => s.weights)
  const storeStage = useQuizStore((s) => s.profile.relationshipStage)

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
    const searchParams = new URLSearchParams(window.location.search)

    // ?s=<score>&g=<grade>[&p=<section base64>&a=<active hex>&c=<cutoff>] 방식 (카카오 공유 URL)
    const sParam = searchParams.get('s')
    const gParam = searchParams.get('g')
    if (sParam && gParam && ['S', 'A', 'B', 'C', 'D'].includes(gParam)) {
      const score = parseInt(sParam, 10)
      if (!isNaN(score)) {
        const SECTION_ORDER: SectionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        const sectionPercents: Record<SectionId, number> = {} as Record<SectionId, number>
        const activeSections: SectionId[] = []
        let cutoffCount = 0
        try {
          const pParam = searchParams.get('p')
          const aParam = searchParams.get('a')
          const cParam = searchParams.get('c')
          if (pParam && aParam) {
            const percentsArr: number[] = JSON.parse(atob(pParam))
            const activeMask = parseInt(aParam, 16)
            SECTION_ORDER.forEach((id, i) => {
              sectionPercents[id] = percentsArr[i] ?? 0
              if (activeMask & (1 << i)) activeSections.push(id)
            })
          }
          if (cParam) cutoffCount = parseInt(cParam, 10) || 0
        } catch {
          // p/a 없거나 파싱 실패 시 빈 데이터로 fallback
        }
        setResult({
          sectionPercents,
          finalScore: score,
          grade: gParam as ScoreResult['grade'],
          activeSections,
          cutoffCount,
        })
        return
      }
    }

    // ?d= 쿼리 파라미터 방식 (신규)
    const d = searchParams.get('d')
    if (d) {
      const shared: SharePayload | null = decodeShare(d)
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

    // #fragment 방식 (하위 호환)
    if (window.location.hash) {
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

  const buildShareUrl = (payload: SharePayload): string => {
    const encoded = encodeShare(payload)
    return `${window.location.origin}/result?d=${encodeURIComponent(encoded)}`
  }

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
    const score = Math.round(result.finalScore)
    const grade = result.grade
    const SECTION_ORDER: SectionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const percentsArr = SECTION_ORDER.map((id) => Math.round(result.sectionPercents[id] ?? 0))
    const activeMask = SECTION_ORDER.reduce(
      (mask, id, i) => (result.activeSections.includes(id) ? mask | (1 << i) : mask), 0
    )
    const p = btoa(JSON.stringify(percentsArr))
    const a = activeMask.toString(16).padStart(2, '0')
    const c = result.cutoffCount
    const compactUrl = `${window.location.origin}/result?s=${score}&g=${grade}&p=${encodeURIComponent(p)}&a=${a}&c=${c}`
    const imageUrl = `${window.location.origin}/og/${grade}.png`
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `내 찰떡 궁합 점수: ${score}점 (${grade}등급)`,
        description: '찰떡 궁합 테스트는 자기 성찰 도구이며, 관계 진단이 아닙니다.',
        imageUrl,
        link: { mobileWebUrl: compactUrl, webUrl: compactUrl },
      },
    })
  }

  const handleDownload = () => {
    if (!result) return
    const safeResult = result
    setCapturing(true)
    try {
      const W = 600
      const P = 36
      const dpr = Math.min(window.devicePixelRatio || 2, 3)

      // wrapText: maxWidth에 맞춰 줄 배열 반환
      function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const words = text.split(' ')
        const lines: string[] = []
        let current = ''
        for (const word of words) {
          const candidate = current ? `${current} ${word}` : word
          if (ctx.measureText(candidate).width > maxWidth && current) {
            lines.push(current)
            current = word
          } else {
            current = candidate
          }
        }
        if (current) lines.push(current)
        return lines
      }

      const GRADE_COLORS: Record<string, { bg: string; fg: string }> = {
        S: { bg: '#dcfce7', fg: '#14532d' },
        A: { bg: '#dbeafe', fg: '#1e3a8a' },
        B: { bg: '#fef9c3', fg: '#713f12' },
        C: { bg: '#ffedd5', fg: '#7c2d12' },
        D: { bg: '#fee2e2', fg: '#7f1d1d' },
      }

      const sections = [...safeResult.activeSections].sort((a, b) => weights[b] - weights[a])
      const score = Math.round(safeResult.finalScore)
      const gc = GRADE_COLORS[safeResult.grade] ?? { bg: '#f3f4f6', fg: '#111827' }
      const gradeConfig = GRADE_CONFIG[safeResult.grade]

      // --- 1-pass: 충분히 큰 canvas에 그리며 최종 y 추적 ---
      const LARGE_H = 4000
      const measureCanvas = document.createElement('canvas')
      measureCanvas.width = W * dpr
      measureCanvas.height = LARGE_H * dpr
      const mctx = measureCanvas.getContext('2d')!
      mctx.scale(dpr, dpr)

      function drawAll(ctx: CanvasRenderingContext2D, totalH: number): number {
        ctx.textBaseline = 'middle'

        // A. 배경
        ctx.fillStyle = '#fff8f8'
        ctx.fillRect(0, 0, W, totalH)

        // A-1. 헤더 영역 배경
        ctx.fillStyle = '#fff1f2'
        ctx.fillRect(0, 0, W, 80)

        let y = 0

        // B. 헤더 (height=80)
        // "찰떡" 좌측
        ctx.font = 'bold 18px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = '#e11d48'
        ctx.fillText('찰떡', P, 40)

        // "궁합 점수" 우측
        ctx.font = '12px system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillStyle = '#9ca3af'
        ctx.fillText('궁합 점수', W - P, 40)

        // "상대방과 나의 적합도" 하단 중앙
        ctx.font = 'bold 20px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#111827'
        ctx.fillText('상대방과 나의 적합도', W / 2, 64)

        y = 80

        // C. 반원 게이지
        const gaugeRadius = 110
        const gaugeThickness = 14
        const gaugeCenterX = W / 2
        const gaugeCenterY = y + gaugeRadius + 16
        const gaugeHeight = gaugeRadius + 16 + 48 // 반지름 + 위 여백 + 점수 텍스트 공간

        // 배경 arc (π ~ 2π)
        ctx.beginPath()
        ctx.arc(gaugeCenterX, gaugeCenterY, gaugeRadius, Math.PI, 2 * Math.PI)
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = gaugeThickness
        ctx.lineCap = 'round'
        ctx.stroke()

        // 점수 arc
        const scoreRatio = Math.min(score / 100, 1)
        const scoreArcEnd = Math.PI + scoreRatio * Math.PI
        let arcColor = '#f87171'
        if (score >= 85) arcColor = '#4ade80'
        else if (score >= 70) arcColor = '#60a5fa'
        else if (score >= 55) arcColor = '#facc15'
        else if (score >= 40) arcColor = '#fb923c'

        if (scoreRatio > 0) {
          ctx.beginPath()
          ctx.arc(gaugeCenterX, gaugeCenterY, gaugeRadius, Math.PI, scoreArcEnd)
          ctx.strokeStyle = arcColor
          ctx.lineWidth = gaugeThickness
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        // 점수 텍스트 (게이지 중앙 하단)
        const scoreText = `${score}`
        ctx.font = 'bold 56px system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillStyle = '#111827'
        const scoreMetrics = ctx.measureText(scoreText)
        const scoreTotalW = scoreMetrics.width
        ctx.font = 'bold 20px system-ui, sans-serif'
        const unitMetrics = ctx.measureText('점')
        const unitW = unitMetrics.width
        const textBlockW = scoreTotalW + 4 + unitW
        const textStartX = gaugeCenterX + textBlockW / 2

        ctx.font = 'bold 56px system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillStyle = '#111827'
        ctx.fillText(scoreText, textStartX - unitW - 4, gaugeCenterY + 8)

        ctx.font = 'bold 20px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = '#6b7280'
        ctx.fillText('점', textStartX - unitW, gaugeCenterY + 8)

        y += gaugeHeight

        // D. 등급 배지
        const gradeLabel = gradeConfig?.label ?? ''
        const gradeText = `${safeResult.grade}등급 — ${gradeLabel}`
        ctx.font = 'bold 15px system-ui, sans-serif'
        ctx.textAlign = 'center'
        const gradeTextW = ctx.measureText(gradeText).width + 32
        ctx.fillStyle = gc.bg
        ctx.beginPath()
        ctx.roundRect((W - gradeTextW) / 2, y, gradeTextW, 36, 10)
        ctx.fill()
        ctx.fillStyle = gc.fg
        ctx.fillText(gradeText, W / 2, y + 18)
        y += 44

        // 등급 설명 (wrapText, 14px, #6b7280, 중앙 정렬)
        ctx.font = '14px system-ui, sans-serif'
        ctx.fillStyle = '#6b7280'
        ctx.textAlign = 'center'
        const descLines = wrapText(ctx, gradeConfig?.description ?? '', W - P * 2)
        for (const line of descLines) {
          ctx.fillText(line, W / 2, y + 9)
          y += 20
        }
        y += 12

        // E. 컷오프 경고 박스
        if (safeResult.cutoffCount > 0) {
          const isSevereCutoff = safeResult.cutoffCount >= 3
          const warnBg = isSevereCutoff ? '#fee2e2' : '#fef9c3'
          const warnBorder = isSevereCutoff ? '#fca5a5' : '#fde68a'
          const warnText = `⚠️ 경고 항목 ${safeResult.cutoffCount}개 감지`

          ctx.fillStyle = warnBg
          ctx.beginPath()
          ctx.roundRect(P, y, W - P * 2, 36, 8)
          ctx.fill()
          ctx.strokeStyle = warnBorder
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.roundRect(P, y, W - P * 2, 36, 8)
          ctx.stroke()

          ctx.font = 'bold 13px system-ui, sans-serif'
          ctx.textAlign = 'left'
          ctx.fillStyle = isSevereCutoff ? '#991b1b' : '#78350f'
          ctx.fillText(warnText, P + 12, y + 18)
          y += 44
        }

        // F. 구분선 + "영역별 점수" 헤딩
        ctx.fillStyle = '#e5e7eb'
        ctx.fillRect(P, y, W - P * 2, 1)
        y += 16

        ctx.font = 'bold 14px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = '#374151'
        ctx.fillText('영역별 점수', P, y + 8)
        y += 28

        // G. 섹션 반복
        for (let i = 0; i < sections.length; i++) {
          const id = sections[i]
          const pct = Math.round(safeResult.sectionPercents[id])
          const barColor = pct >= 70 ? '#4ade80' : pct >= 55 ? '#facc15' : '#f87171'
          const barMaxW = W - P * 2

          // 섹션명 + 퍼센트
          ctx.font = '13px system-ui, sans-serif'
          ctx.textAlign = 'left'
          ctx.fillStyle = '#374151'
          ctx.fillText(`${id}. ${SECTION_TITLES[id]}`, P, y + 8)

          ctx.font = 'bold 13px system-ui, sans-serif'
          ctx.textAlign = 'right'
          ctx.fillStyle = '#111827'
          ctx.fillText(`${pct}%`, W - P, y + 8)
          y += 24

          // 바 차트 (높이 12px)
          ctx.fillStyle = '#e5e7eb'
          ctx.beginPath()
          ctx.roundRect(P, y, barMaxW, 12, 6)
          ctx.fill()

          const fillW = barMaxW * pct / 100
          if (fillW > 0) {
            ctx.fillStyle = barColor
            ctx.beginPath()
            ctx.roundRect(P, y, Math.max(fillW, 8), 12, 6)
            ctx.fill()
          }
          y += 18

          // 코멘트 (wrapText, 12px, 줄 간격 17px)
          ctx.font = '12px system-ui, sans-serif'
          ctx.textAlign = 'left'
          ctx.fillStyle = '#6b7280'
          const comment = getSectionComment(pct, id)
          const commentLines = wrapText(ctx, comment, W - P * 2)
          for (const line of commentLines) {
            ctx.fillText(line, P, y + 8)
            y += 17
          }
          y += 12

          // 섹션 사이 구분선 (마지막 제외)
          if (i < sections.length - 1) {
            ctx.fillStyle = '#f3f4f6'
            ctx.fillRect(P, y, W - P * 2, 1)
            y += 16
          }
        }

        // H. 푸터
        y += 20
        ctx.font = '11px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#9ca3af'
        ctx.fillText('찰떡 궁합 테스트는 자기 성찰 도구이며, 관계 진단이 아닙니다.', W / 2, y + 8)
        y += 24

        ctx.fillStyle = '#e11d48'
        ctx.fillText('chalteok.kro.kr', W / 2, y + 8)
        y += 24

        return y + P
      }

      // 1-pass: 최종 높이 측정
      const measuredH = drawAll(mctx, LARGE_H)

      // 2-pass: 정확한 높이로 최종 canvas 생성
      const canvas = document.createElement('canvas')
      canvas.width = W * dpr
      canvas.height = measuredH * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)
      drawAll(ctx, measuredH)

      const link = document.createElement('a')
      link.download = `찰떡궁합_결과_${score}점.png`
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
    const url = buildShareUrl(payload)
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
                pct >= 70 ? 'bg-green-400' : pct >= 55 ? 'bg-yellow-400' : 'bg-red-400'
              const comment = getSectionComment(pct, id)
              return (
                <div key={id} className="pb-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">
                      {id}. {SECTION_TITLES[id]}
                    </span>
                    <span className="font-semibold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{comment}</p>
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
            찰떡 궁합 테스트는 자기 성찰 도구이며, 관계 진단이 아닙니다.
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
              useQuizStore.getState().reset()
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
