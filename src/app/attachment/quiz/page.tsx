'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAttachmentStore } from '@/store/attachment'
import { ATTACHMENT_QUESTIONS } from '@/data/attachmentQuestions'
import { loadKakaoSdk, initKakao } from '@/lib/kakaoSdk'

const TOTAL = ATTACHMENT_QUESTIONS.length

const LIKERT_OPTIONS = [
  { value: 1, label: '전혀\n아니다' },
  { value: 2, label: '거의\n아니다' },
  { value: 3, label: '보통\n이다' },
  { value: 4, label: '대체로\n그렇다' },
  { value: 5, label: '매우\n그렇다' },
]

export default function AttachmentQuizPage() {
  const router = useRouter()
  const termsAgreed = useAttachmentStore((s) => s.termsAgreed)
  const answers = useAttachmentStore((s) => s.answers)
  const setAnswer = useAttachmentStore((s) => s.setAnswer)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!termsAgreed) {
      router.replace('/attachment/terms')
    }
  }, [termsAgreed, router])

  useEffect(() => {
    loadKakaoSdk().then(initKakao).catch(() => {})
  }, [])

  const question = ATTACHMENT_QUESTIONS[currentIndex]
  const currentAnswer = answers[question?.id]
  const progress = currentIndex / TOTAL

  const handleSelect = (value: number) => {
    if (animating || !question) return

    setAnswer(question.id, value)
    setAnimating(true)
    setVisible(false)

    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL) {
        router.push('/attachment/result')
      } else {
        setCurrentIndex((i) => i + 1)
        setVisible(true)
        setAnimating(false)
      }
    }, 350)
  }

  if (!termsAgreed || !question) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      {/* 진행률 바 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>애착유형 테스트</span>
            <span>{currentIndex + 1} / {TOTAL}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8">
        <div className="w-full max-w-lg">
          {/* 문항 카드 */}
          <div
            className="transition-all duration-300"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">
                  {question.axis === 'anxiety' ? '불안 축' : '회피 축'}
                </span>
              </div>
              <p className="text-base font-medium text-gray-800 leading-relaxed">
                {question.text}
              </p>
            </div>

            {/* 리커트 선택지 */}
            <div className="grid grid-cols-5 gap-2">
              {LIKERT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  disabled={animating}
                  className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border text-xs transition-all duration-150 disabled:cursor-not-allowed ${
                    currentAnswer === opt.value
                      ? 'bg-sky-500 text-white border-sky-500 scale-105 shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-sky-300 hover:bg-sky-50 active:scale-95'
                  }`}
                >
                  <span className="font-bold text-base leading-none">{opt.value}</span>
                  <span className="text-center leading-tight whitespace-pre-line text-[10px]">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              선택 즉시 다음 문항으로 이동합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
