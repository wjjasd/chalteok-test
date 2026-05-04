'use client'

import ProgressBar from './ProgressBar'

interface StepLayoutProps {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  children: React.ReactNode
}

const STEP_LABELS: Record<number, string> = {
  1: '랜딩',
  2: '약관 동의',
  3: '프로필 입력',
  4: '가중치 설정',
  5: '섹션 A',
  6: '섹션 B',
  7: '섹션 C',
  8: '섹션 D',
  9: '섹션 E',
  10: '섹션 F',
  11: '섹션 G',
  12: '섹션 H',
  13: '컷오프 항목',
  14: '결과',
}

export default function StepLayout({ step, totalSteps, title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {step > 1 && step < totalSteps && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-lg mx-auto">
            <ProgressBar current={step - 1} total={totalSteps - 2} label={STEP_LABELS[step]} />
          </div>
        </div>
      )}
      <main className={`flex-1 flex flex-col items-center px-4 py-8 ${step > 1 && step < totalSteps ? 'pt-16' : ''}`}>
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
