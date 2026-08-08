import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 찰떡 테스트',
  description: '찰떡 테스트(chalteok.com)의 개인정보처리방침입니다.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-xs text-gray-400 mb-8">시행일: 2026-07-18</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. 개인정보 수집 및 이용</h2>
            <p>
              찰떡 테스트(이하 &apos;서비스&apos;)는 이름, 연락처, 이메일 등 이용자를 식별할 수 있는 개인정보를 별도로 입력받거나 서버에 저장하지 않습니다. 테스트 응답과 결과는 이용자의 브라우저 안에서만 처리됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. 자동 수집 정보 및 쿠키</h2>
            <p className="mb-2">
              서비스 이용 과정에서 아래 정보가 쿠키·기기 식별자를 통해 자동으로 수집될 수 있습니다.
            </p>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li>접속 IP, 기기·브라우저 정보, 방문 페이지, 체류 시간 등 이용 통계 (Google Analytics)</li>
              <li>광고 개인화 및 게재를 위한 쿠키 정보 (카카오 애드핏)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. 수집 목적</h2>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li>서비스 이용 현황 분석 및 개선</li>
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
              서버에 개인정보를 저장하지 않으므로 별도 보유 기간이 없습니다. 쿠키는 각 서비스(Google, 카카오)가 정한 기간에 따라 이용자 브라우저에 저장·소멸됩니다.
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
