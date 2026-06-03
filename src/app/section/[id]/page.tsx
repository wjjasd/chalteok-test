'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SECTIONS, SectionId, getActiveSections } from '@/lib/questions'
import { useQuizStore } from '@/store/quiz'
import StepLayout from '@/components/StepLayout'

const SECTION_ORDER: SectionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const LIKERT_LABELS = ['전혀\n아니다', '거의\n아니다', '보통\n이다', '대체로\n그렇다', '매우\n그렇다']

function idToSection(id: string): SectionId {
  return id.toUpperCase() as SectionId
}

function sectionToStep(sectionId: SectionId): number {
  return SECTION_ORDER.indexOf(sectionId) + 4
}

function nextRoute(
  currentId: SectionId,
  activeSections: SectionId[],
): string {
  const currentIdx = SECTION_ORDER.indexOf(currentId)
  for (let i = currentIdx + 1; i < SECTION_ORDER.length; i++) {
    const next = SECTION_ORDER[i]
    if (activeSections.includes(next)) {
      return `/section/${next.toLowerCase()}`
    }
  }
  return '/flags'
}

export default function SectionPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const rawId = Array.isArray(params.id) ? params.id[0] : (params.id ?? 'a')
  const sectionId = idToSection(rawId)
  const section = SECTIONS.find((s) => s.id === sectionId)

  const answers = useQuizStore((s) => s.answers)
  const setAnswer = useQuizStore((s) => s.setAnswer)
  const relationshipStage = useQuizStore((s) => s.profile.relationshipStage)
  const activeSections = getActiveSections(relationshipStage)

  if (!section) {
    return <div className="p-8 text-center text-gray-400">잘못된 섹션입니다.</div>
  }

  const allAnswered = section.questions.every(
    (q) => answers[`Q${q.id}`] !== undefined,
  )

  const handleNext = () => {
    setLoading(true)
    router.push(nextRoute(sectionId, activeSections))
  }

  return (
    <StepLayout
      step={sectionToStep(sectionId)}
      totalSteps={13}
      title={`${sectionId}. ${section.title}`}
      subtitle={section.subtitle}
    >
      <div className="space-y-6 mb-8">
        {section.questions.map((q, qi) => {
          const key = `Q${q.id}`
          const current = answers[key] as number | undefined

          return (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-800 mb-4 leading-relaxed">
                <span className="text-gray-400 mr-1">{qi + 1}.</span>
                {q.text}
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAnswer(key, val)}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-xs transition-colors ${
                      current === val
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <span className="font-semibold text-base leading-none">{val}</span>
                    <span className="text-center leading-tight whitespace-pre-line text-[11px]">
                      {LIKERT_LABELS[val]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!allAnswered || loading}
        className="w-full py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : '다음'}
      </button>
    </StepLayout>
  )
}
