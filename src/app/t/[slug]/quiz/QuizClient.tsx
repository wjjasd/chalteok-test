'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TestDefinition } from '@/lib/tests/types'
import { THEMES } from '@/lib/tests/themes'
import { scoreTest } from '@/lib/tests/scoring'
import { track } from '@/lib/analytics'
import TestHeader from '@/components/TestHeader'

import { mineKey } from '@/lib/tests/mine'

export default function QuizClient({ test }: { test: TestDefinition }) {
  const router = useRouter()
  const theme = THEMES[test.theme]
  const total = test.questions.length

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [visible, setVisible] = useState(true)
  const [busy, setBusy] = useState(false)

  const question = test.questions[index]

  const select = (optionIndex: number) => {
    if (busy) return
    const next = [...answers]
    next[index] = optionIndex
    setAnswers(next)
    setBusy(true)
    setVisible(false)

    setTimeout(() => {
      if (index + 1 >= total) {
        const result = scoreTest(test, next)
        try {
          sessionStorage.setItem(mineKey(test.slug), result.id)
        } catch {}
        track('test_complete', { test_slug: test.slug, result_id: result.id })
        router.push(`/t/${test.slug}/r/${result.id}`)
        return
      }
      setIndex(index + 1)
      setVisible(true)
      setBusy(false)
    }, 280)
  }

  const back = () => {
    if (busy || index === 0) return
    setIndex(index - 1)
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme.pageBg}`}>
      {/* 답변은 이 컴포넌트 state에만 있어 페이지를 떠나면 사라짐 → 한 문항이라도 답했으면 홈 이동 전 확인 */}
      <TestHeader
        title={test.title}
        progress={{ value: index / total, label: `${index + 1} / ${total}`, barClass: theme.progress }}
        confirmLeave={answers.length > 0}
        extra={
          <button
            type="button"
            onClick={back}
            disabled={index === 0}
            className="min-w-11 min-h-11 px-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:invisible"
            aria-label="이전 문항"
          >
            ← 이전
          </button>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
        <div
          className="w-full max-w-lg transition-all duration-300"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <p className={`text-xs font-bold mb-3 ${theme.accentText}`}>Q{index + 1}</p>
            <p className="text-lg font-semibold text-gray-800 leading-relaxed">{question.text}</p>
          </div>

          <div className="grid gap-2.5">
            {question.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => select(i)}
                disabled={busy}
                className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed ${
                  answers[index] === i ? theme.optionActive : `bg-white text-gray-700 border-gray-200 ${theme.option}`
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
