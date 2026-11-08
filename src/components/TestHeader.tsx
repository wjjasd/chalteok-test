'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TestHeaderProps {
  title: string
  /** 진행 화면에서만. value는 0~1 */
  progress?: { value: number; label: string; barClass: string }
  /** 홈으로 가면 지금까지의 답변이 사라질 때 true — 앱 내 확인창을 한 번 띄운다 */
  confirmLeave?: boolean
  /** 홈 버튼 오른쪽에 붙는 보조 버튼 (예: 이전 문항) */
  extra?: React.ReactNode
}

export default function TestHeader({ title, progress, confirmLeave = false, extra }: TestHeaderProps) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className={`max-w-lg mx-auto px-2 ${progress ? 'pt-1 pb-2.5' : 'py-1'}`}>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              aria-label="찰떡 테스트 홈으로 가기"
              onClick={(e) => {
                if (!confirmLeave) return
                e.preventDefault()
                dialogRef.current?.showModal()
              }}
              className="flex items-center gap-1 min-w-11 min-h-11 px-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
              </svg>
              <span className="text-xs font-semibold">홈</span>
            </Link>
            {extra}
            <span className="flex-1 min-w-0 truncate text-center text-xs font-semibold text-gray-500">{title}</span>
            <span className="min-w-11 px-2 text-right text-xs text-gray-400 tabular-nums">{progress?.label}</span>
          </div>
          {progress && (
            <div
              role="progressbar"
              aria-label={`${title} 진행률`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress.value * 100)}
              className="mx-2 mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${progress.barClass}`}
                style={{ width: `${progress.value * 100}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {confirmLeave && (
        <dialog
          ref={dialogRef}
          aria-labelledby="leave-title"
          className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl p-0 shadow-xl backdrop:bg-black/40"
          onClick={(e) => {
            // 내용 div 바깥(= backdrop) 클릭 시 닫기
            if (e.target === e.currentTarget) e.currentTarget.close()
          }}
        >
          <div className="p-6">
            <h2 id="leave-title" className="text-base font-bold text-gray-900">
              테스트를 그만두고 홈으로 갈까요?
            </h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">지금까지 고른 답은 저장되지 않아요.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="min-h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                계속 풀기
              </button>
              <button
                type="button"
                onClick={() => {
                  dialogRef.current?.close()
                  router.push('/')
                }}
                className="min-h-11 rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800"
              >
                홈으로
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
