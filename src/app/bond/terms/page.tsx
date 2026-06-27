'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import StepLayout from '@/components/StepLayout'

export default function TermsPage() {
  const router = useRouter()
  const setTermsAgreed = useQuizStore((s) => s.setTermsAgreed)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [loading, setLoading] = useState(false)

  const canProceed = check1 && check2

  const handleNext = () => {
    setLoading(true)
    setTermsAgreed(true)
    router.push('/bond/profile')
  }

  return (
    <StepLayout step={2} totalSteps={14} title="면책 고지 및 약관 동의">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-sm text-gray-700 leading-relaxed space-y-4 max-h-80 overflow-y-auto">
        <p className="font-semibold text-gray-900">[ 면책 고지 ]</p>
        <ol className="list-decimal pl-4 space-y-3 text-gray-600">
          <li>
            본 서비스는 심리 검사, 의료 진단, 상담 행위가 <strong>아닙니다</strong>. 결과는 학술적으로 검증된 표준화 심리 척도가 아니며, 어떠한 임상적·법적 효력도 갖지 않습니다.
          </li>
          <li>
            결과를 근거로 관계의 지속·종료·변경 등 중요한 결정을 내리는 것은 <strong>권장하지 않습니다</strong>. 중요한 관계 문제에 대해서는 반드시 전문 상담사 또는 심리 전문가의 도움을 받으시기 바랍니다.
          </li>
          <li>
            본 점수 체계는 완전하지 않으며, 인간 관계의 복잡성을 하나의 숫자로 환원할 수 없습니다. 결과를 맹신하지 마십시오.
          </li>
          <li>
            서비스 제공자는 본 서비스 이용으로 인해 발생하는 직·간접적 손해에 대해 법적 책임을 지지 않습니다.
          </li>
          <li>
            결과 공유 시 타인의 명예·프라이버시를 침해하지 않도록 유의하십시오. 결과를 이용하여 특정인을 비하·차별·공격하는 행위는 관련 법령에 따라 이용자 본인에게 책임이 있습니다.
          </li>
        </ol>
        <div className="mt-4 pt-4 border-t border-gray-100 text-gray-500">
          <p className="font-semibold text-gray-700 mb-2">개인정보 처리 원칙</p>
          <ul className="space-y-1">
            <li>· 이름, 연락처, 주소 등 개인정보는 일체 수집하지 않습니다.</li>
            <li>· 응답 데이터는 브라우저 세션에서만 처리하며 서버에 저장되지 않습니다.</li>
            <li>· 개인 식별 쿠키를 사용하지 않습니다.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={check1}
            onChange={(e) => setCheck1(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-rose-500 accent-rose-500 flex-shrink-0"
          />
          <span className="text-sm text-gray-700">위 면책 고지를 읽었으며 동의합니다.</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={check2}
            onChange={(e) => setCheck2(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-rose-500 accent-rose-500 flex-shrink-0"
          />
          <span className="text-sm text-gray-700">본 결과를 절대적 기준으로 사용하지 않겠습니다.</span>
        </label>
      </div>

      <button
        onClick={handleNext}
        disabled={!canProceed || loading}
        className="w-full py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : '동의하고 계속하기'}
      </button>
    </StepLayout>
  )
}
