import type { Metadata } from 'next'
import { SITE_OG } from '@/lib/site'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 찰떡 테스트',
  alternates: { canonical: 'https://chalteok.com/privacy' },
  description: '찰떡 테스트(chalteok.com)의 개인정보처리방침입니다.',
  openGraph: {
    ...SITE_OG,
    url: 'https://chalteok.com/privacy',
    title: '개인정보처리방침 | 찰떡 테스트',
    description: '찰떡 테스트(chalteok.com)의 개인정보처리방침입니다.',
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-xs text-gray-400 mb-8">시행일: 2026-11-26 · 변경 이력: 2026-07-18 제정, 2026-11-26 테스트 결과·이용 기록·공유 링크·카카오톡 공유 항목 명시</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. 개인정보 수집 및 이용</h2>
            <p>
              찰떡 테스트(이하 &apos;서비스&apos;)는 이름, 연락처, 이메일 등 이용자를 식별할 수 있는 개인정보를 별도로 입력받지 않습니다. 테스트 응답은 이용자의 브라우저에서 처리되며, 결과 화면과 이용 통계 작성에 쓰입니다. 결과를 링크로 공유하면 링크 주소에 결과 정보가 담기며(예: 궁합 테스트는 점수·등급·영역별 점수·가중치·경고 항목(Q41~45) 응답 여부, 애착 테스트는 불안·회피 점수), 해당 링크 방문 기록은 아래 2항의 이용 통계로 수집될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. 자동 수집 정보 및 쿠키</h2>
            <p className="mb-2">
              서비스 이용 과정에서 아래 정보가 쿠키·기기 식별자를 통해 자동으로 수집될 수 있습니다.
            </p>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li>접속 IP, 기기·브라우저 정보, 방문 페이지(결과 페이지 주소 포함), 체류 시간 등 이용 통계 (Google Analytics)</li>
              <li>테스트 결과 유형과 테스트 시작·완료·공유·이미지 저장·다시하기 등 이용 기록 (Google Analytics)</li>
              <li>광고 개인화 및 게재를 위한 쿠키 정보 (카카오 애드핏)</li>
              <li>카카오톡 공유 시 결과 제목·결과 링크(테스트에 따라 점수 포함) 등 공유 내용 (카카오 JavaScript SDK)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. 수집 목적</h2>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li>서비스 이용 현황 분석 및 개선</li>
              <li>테스트 결과 유형별 분포 등 콘텐츠 통계 작성</li>
              <li>광고 게재 및 맞춤 광고 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. 제3자 서비스</h2>
            <p className="mb-2">
              서비스는 아래 외부 서비스를 이용하며, 각 서비스의 개인정보 처리는 해당 사업자의 정책을 따릅니다.
            </p>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li>
                Google Analytics —{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline">
                  구글 개인정보처리방침
                </a>
              </li>
              <li>
                카카오톡 공유(카카오 JavaScript SDK) —{' '}
                <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline">
                  카카오 개인정보처리방침
                </a>
              </li>
              <li>
                카카오 애드핏 —{' '}
                <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline">
                  카카오 개인정보처리방침
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. 쿠키 거부 방법</h2>
            <p className="mb-2">
              이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으며, 이 경우 서비스 이용 자체에는 영향이 없으나 맞춤 광고가 제한될 수 있습니다.
            </p>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li>
                Google 광고 개인화 설정:{' '}
                <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline">
                  adssettings.google.com
                </a>
              </li>
              <li>브라우저 설정 &gt; 개인정보 및 보안 &gt; 쿠키에서 전체 차단 가능</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. 보유 및 이용 기간</h2>
            <p>
              서비스가 직접 운영하는 서버에는 개인정보를 저장하지 않으므로 별도 보유 기간이 없습니다. Google Analytics·카카오 애드핏·카카오톡 공유를 통해 각 사업자에게 전달된 정보와 쿠키는 각 사업자(Google, 카카오)가 정한 기간에 따라 보관·소멸됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. 문의</h2>
            <p>
              개인정보 관련 문의는 아래 이메일로 연락해 주세요.
              <br />
              wjjasd@gmail.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
