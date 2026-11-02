// 사이트 공통 SEO 값. Next 메타데이터는 openGraph 객체를 세그먼트 단위로 통째로 덮어쓰므로,
// 하위 페이지에서 openGraph를 지정할 때는 SITE_OG를 펼쳐서(...SITE_OG) 공통 값을 유지한다.
export const SITE_TITLE = '찰떡 테스트 — 무료 심리테스트 모음 | 연애·성격·직장 테스트'
export const SITE_DESC =
  '1분이면 끝나는 무료 심리테스트 모음. 연애 궁합, 애착유형, 퇴사 타이밍까지 회원가입 없이 바로 하고 결과는 카톡으로 공유하세요. 응답은 기기 밖으로 전송되지 않아요.'

export const SITE_OG = {
  type: 'website' as const,
  locale: 'ko_KR',
  siteName: '찰떡 테스트',
  title: SITE_TITLE,
  description: SITE_DESC,
  images: [{ url: '/api/og/site', width: 1200, height: 630 }],
}
