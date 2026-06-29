'use client'

import Link from 'next/link'

export default function HubPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-lg text-center">
        <div className="mb-4">
          <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            관계 성찰 도구
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
          관계 안에서<br />나를 발견하는 시간
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          나와 관계를 더 잘 이해하고 싶은 사람을 위한 성찰 테스트
        </p>

        <div className="grid gap-4">
          <Link
            href="/bond"
            className="group bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-rose-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-2xl flex-shrink-0">
                💑
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-gray-900">찰떡 궁합 테스트</h2>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">인기</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  두 사람의 관계를 8개 영역에서 구조적으로 살펴봅니다.
                  45문항 · 약 10분
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-rose-400 transition-colors flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/attachment"
            className="group bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-sky-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-2xl flex-shrink-0">
                🌊
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-gray-900">애착유형 테스트</h2>
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">신규</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  나의 연애 애착 패턴을 불안·회피 2축으로 살펴봅니다.
                  12문항 · 약 3분
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-sky-400 transition-colors flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          모든 테스트는 성찰 보조 도구이며, 전문적 심리 진단이 아닙니다.
        </p>
      </div>
    </main>
  )
}
