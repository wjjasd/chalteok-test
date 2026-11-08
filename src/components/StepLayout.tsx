'use client'

import TestHeader from './TestHeader'

interface StepLayoutProps {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  children: React.ReactNode
}

// 가중치 화면 제거(2026-05-29) 후 단계 번호: section/[id]는 A=4…H=11, flags=12
const STEP_LABELS: Record<number, string> = {
  1: '랜딩',
  2: '약관 동의',
  3: '프로필 입력',
  4: '섹션 A',
  5: '섹션 B',
  6: '섹션 C',
  7: '섹션 D',
  8: '섹션 E',
  9: '섹션 F',
  10: '섹션 G',
  11: '섹션 H',
  12: '컷오프 항목',
  13: '결과',
}

// 찰떡 궁합 테스트 진행 화면 공통 틀. 답변은 sessionStorage(store/quiz.ts persist)에 남으므로 홈 이동 확인창은 띄우지 않는다
export default function StepLayout({ step, totalSteps, title, subtitle, children }: StepLayoutProps) {
  const pct = Math.round(((step - 1) / (totalSteps - 2)) * 100)
  return (
    <div className="min-h-screen flex flex-col">
      <TestHeader
        title="찰떡 궁합 테스트"
        progress={{ value: pct / 100, label: `${STEP_LABELS[step]} · ${pct}%`, barClass: 'bg-rose-500' }}
      />
      <main className="flex-1 flex flex-col items-center px-4 pt-24 pb-8">
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
