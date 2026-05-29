'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { SectionId } from '@/lib/questions'
import StepLayout from '@/components/StepLayout'

const SECTION_META: { id: SectionId; title: string; desc: string }[] = [
  { id: 'A', title: '초기 끌림',   desc: '신체적·감정적 끌림, 다시 보고 싶은 마음' },
  { id: 'B', title: '대화 적합도', desc: '대화 흐름, 경청, 소통의 편안함' },
  { id: 'C', title: '감정 안정성', desc: '감정 기복, 갈등 시 대화 가능 여부' },
  { id: 'D', title: '가치관',      desc: '돈·결혼·삶의 우선순위 방향성' },
  { id: 'E', title: '생활 적합도', desc: '수면·소비·청결 등 일상 습관' },
  { id: 'F', title: '신뢰',        desc: '약속 이행, 솔직함, 회피 없는 태도' },
  { id: 'G', title: '관계 흐름',   desc: '갈등 회복, 반복 패턴, 관계 피로도' },
  { id: 'H', title: '자기 변화',   desc: '자존감, 삶의 질, 나다움 유지 여부' },
]

const PRESETS: { label: string; desc: string; weights: Record<SectionId, number> }[] = [
  {
    label: '초기 관계',
    desc: '소개팅·만남 초기에 적합',
    weights: { A: 20, B: 18, C: 12, D: 12, E: 8, F: 12, G: 8, H: 10 },
  },
  {
    label: '가치·신뢰',
    desc: '관계 지속 여부 판단에 적합',
    weights: { A: 8, B: 10, C: 12, D: 16, E: 8, F: 16, G: 18, H: 12 },
  },
  {
    label: '장기 연애',
    desc: '동거·결혼 고려 시 적합',
    weights: { A: 8, B: 10, C: 14, D: 14, E: 16, F: 12, G: 14, H: 12 },
  },
]

const MIN_W = 5
const MAX_W = 40

const VALUE_LABELS: Record<string, string> = {
  trust: '신뢰',
  communication: '소통',
  emotional_stability: '정서적 안정',
  values: '가치관 일치',
  lifestyle: '생활 습관',
  attraction: '신체적 끌림',
}

export default function WeightsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const weights = useQuizStore((s) => s.weights)
  const setWeight = useQuizStore((s) => s.setWeight)
  const setWeights = useQuizStore((s) => s.setWeights)
  const resetWeights = useQuizStore((s) => s.resetWeights)
  const applyRecommendedWeights = useQuizStore((s) => s.applyRecommendedWeights)
  const importantValues = useQuizStore((s) => s.profile.importantValues)

  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  const remaining = 100 - total
  const isValid = total === 100

  const handleSlider = (id: SectionId, newVal: number) => {
    const clamped = Math.min(MAX_W, Math.max(MIN_W, newVal))
    setWeight(id, clamped)
  }

  return (
    <StepLayout
      step={4}
      totalSteps={14}
      title="섹션 가중치 설정"
      subtitle="각 영역이 나에게 얼마나 중요한지 100포인트를 배분해 주세요."
    >
      {/* P5 기반 자동 추천 */}
      {importantValues.length > 0 && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">내 우선순위 기반 추천</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {importantValues.map((v) => (
              <span
                key={v}
                className="text-xs px-2 py-1 rounded-lg bg-rose-100 text-rose-700 font-medium"
              >
                {VALUE_LABELS[v] ?? v}
              </span>
            ))}
          </div>
          <button
            onClick={applyRecommendedWeights}
            className="text-xs px-3 py-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors font-medium"
          >
            이 우선순위로 가중치 추천 적용
          </button>
        </div>
      )}

      {/* 프리셋 */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-medium">빠른 설정 (프리셋)</p>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setWeights(p.weights)}
              title={p.desc}
              className="text-xs px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={resetWeights}
            className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${
          remaining === 0
            ? 'bg-green-100 text-green-700'
            : remaining > 0
            ? 'bg-blue-100 text-blue-700'
            : 'bg-red-100 text-red-600'
        }`}>
          남은 포인트: {remaining}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {SECTION_META.map(({ id, title, desc }) => (
          <div key={id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900 text-sm">{id}. {title}</span>
              <span className="text-lg font-bold text-rose-500 w-10 text-right">
                {weights[id]}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{desc}</p>
            <input
              type="range"
              min={MIN_W}
              max={MAX_W}
              step={1}
              value={weights[id]}
              onChange={(e) => handleSlider(id, Number(e.target.value))}
              className="w-full h-2 appearance-none rounded-full bg-gray-200 accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{MIN_W}</span>
              <span>{MAX_W}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">
        각 섹션은 최소 {MIN_W}점 ~ 최대 {MAX_W}점, 합계는 정확히 100점이어야 합니다.
      </p>

      <button
        onClick={() => { setLoading(true); router.push('/section/a') }}
        disabled={!isValid || loading}
        className="w-full py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isValid ? '설문 시작하기' : `합계가 ${total}점입니다 (100점이 되어야 합니다)`}
      </button>
    </StepLayout>
  )
}
