'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAttachmentStore } from '@/store/attachment'

export default function AttachmentLandingPage() {
  const router = useRouter()
  const reset = useAttachmentStore((s) => s.reset)
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    reset()
    setLoading(true)
    router.push('/attachment/terms')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-sky-50 to-white">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6">
          <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            애착유형 테스트
          </span>
        </div>

        <div className="text-5xl mb-5">🌊</div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          나는 어떤 바다일까?
        </h1>

        <p className="text-gray-600 text-lg mb-4 leading-relaxed">
          연애에서 반복되는 나만의 패턴,<br />
          불안과 회피 두 축으로 살펴봅니다.
        </p>

        <p className="text-sm text-gray-400 mb-10">
          총 12문항 · 약 3분 · 서버 저장 없음
        </p>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full max-w-xs bg-sky-600 hover:bg-sky-700 disabled:opacity-100 disabled:bg-sky-300 text-white font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-md shadow-sky-200"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : '테스트 시작'}
        </button>

        <button
          onClick={() => router.push('/')}
          className="mt-3 w-full max-w-xs py-3.5 px-8 rounded-2xl font-semibold border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors text-sm"
        >
          다른 테스트 보기
        </button>

        <div className="mt-10 grid grid-cols-2 gap-4 text-center text-sm text-gray-500">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🔒</div>
            <div>개인정보<br />미저장</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🌊</div>
            <div>5가지<br />유형</div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          본 서비스는 성찰 보조 도구이며, 전문적 심리 진단이 아닙니다.
        </p>
      </div>
    </main>
  )
}
