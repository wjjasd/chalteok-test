'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BondLandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-rose-50 to-white">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            관계 적합도 테스트
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          찰떡 궁합 테스트
        </h1>

        <p className="text-gray-600 text-lg mb-4 leading-relaxed">
          두 사람의 관계를 여러 영역에서<br />
          구조적으로 살펴보는 자기 성찰 도구입니다.
        </p>

        <p className="text-sm text-gray-400 mb-10">
          총 45문항 · 약 10분 소요 · 서버 저장 없음
        </p>

        <button
          onClick={() => { setLoading(true); router.push('/bond/terms') }}
          disabled={loading}
          className="w-full max-w-xs bg-rose-500 hover:bg-rose-600 disabled:opacity-100 disabled:bg-rose-300 disabled:text-white text-white font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-md shadow-rose-200"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : '시작하기'}
        </button>

        <div className="mt-10 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🔒</div>
            <div>개인정보<br />미저장</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🎯</div>
            <div>8개 영역<br />분석</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">📊</div>
            <div>맞춤형<br />가중치</div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          본 서비스는 성찰 보조 도구이며, 전문적 심리 진단이 아닙니다.
        </p>
      </div>
    </main>
  )
}
