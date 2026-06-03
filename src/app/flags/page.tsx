'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CUTOFF_QUESTIONS } from '@/lib/questions'
import { useQuizStore } from '@/store/quiz'
import StepLayout from '@/components/StepLayout'

export default function FlagsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const answers = useQuizStore((s) => s.answers)
  const setAnswer = useQuizStore((s) => s.setAnswer)

  const allAnswered = CUTOFF_QUESTIONS.every(
    (q) => answers[`Q${q.id}`] !== undefined,
  )

  return (
    <StepLayout
      step={12}
      totalSteps={13}
      title="컷오프 항목 확인"
      subtitle="이 항목들은 점수에 반영되지 않지만, 결과 화면에서 별도로 안내됩니다."
    >
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700">
        솔직하게 응답해 주세요. 어떤 판단도 하지 않습니다.
      </div>

      <div className="space-y-3 mb-8">
        {CUTOFF_QUESTIONS.map((q) => {
          const key = `Q${q.id}`
          const current = answers[key] as boolean | undefined

          return (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">
                {q.text}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAnswer(key, true)}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-sm border transition-colors ${
                    current === true
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                  }`}
                >
                  예 (YES)
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer(key, false)}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-sm border transition-colors ${
                    current === false
                      ? 'bg-gray-700 text-white border-gray-700'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  아니요 (NO)
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => { setLoading(true); router.push('/result') }}
        disabled={!allAnswered || loading}
        className="w-full py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : '결과 보기'}
      </button>
    </StepLayout>
  )
}
