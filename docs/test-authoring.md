# 테스트 콘텐츠 작성 가이드

`/t/<slug>` 범용 테스트 엔진용. 테스트 하나 = `src/content/tests/<slug>.ts` 파일 하나 + `index.ts` 등록 두 줄.
스키마: `src/lib/tests/types.ts` · 채점: `src/lib/tests/scoring.ts` · 검증: `npm run validate:tests -- <slug>`

## 1. 파일 형식

```ts
import type { TestDefinition } from '@/lib/tests/types'   // ← import type만 허용 (검증기가 Node로 직접 읽음)

const test: TestDefinition = {
  slug: 'love-temperature',            // 파일명과 동일, 영문 소문자·숫자·하이픈
  title: '연애 온도 테스트',
  subtitle: '나는 뜨거운 사랑꾼일까, 미지근한 현실파일까?',
  intro: '연애할 때 내 감정의 온도는 몇 도일까요?\n10개의 상황에 솔직하게 답해 보세요.',
  emoji: '🌡️',
  theme: 'rose',                       // rose sky violet amber emerald pink indigo teal
  category: 'love',                    // love personality friend life
  scoring: 'type',                     // type | score
  publishedAt: '2026-11-02',
  updatedAt: '2026-11-02',             // 문항·결과·SEO 본문을 고칠 때마다 그날로 갱신 (sitemap lastmod)
  seo: {
    title: '연애 온도 테스트 — 나의 연애 스타일 온도 측정 | 찰떡 테스트',   // 60자 이내
    description: '…',                  // 50~160자, 검색 키워드 자연스럽게 포함
  },
  shareTitle: '내 연애 온도는 {name} {emoji}',   // {name} 필수
  questions: [
    {
      id: 'q1',
      text: '썸 타는 사람에게 답장이 3시간째 없다. 나는?',
      options: [
        { label: '바쁜가 보다 하고 내 할 일 한다', weights: { cool: 2 } },
        { label: '폰을 자꾸 확인하게 된다', weights: { hot: 2, warm: 1 } },
      ],
    },
  ],
  results: [
    {
      id: 'hot',
      name: '100℃ 끓는점형',
      emoji: '🔥',
      tagline: '사랑 앞에서 망설임 없는 직진러',
      description: '2~4문장. 공감 → 장점 → 주의점 순서.',
      traits: ['3~5개', '구체적 행동 묘사', '“나 이거 완전 그래” 반응이 나오게'],
      advice: '한 줄 조언',
      bestMatch: 'warm',
      worstMatch: 'cool',
    },
  ],
}

export default test
```

`index.ts` 등록 (마커 바로 아래에 추가):
```ts
// @new-test:imports
import loveTemperature from './love-temperature'
…
  // @new-test:list
  loveTemperature,
```

## 2. 채점 모델 고르기

| 모델 | 언제 | 규칙 |
|---|---|---|
| `type` | "나는 어떤 유형?" (대부분) | 선택지마다 `weights: { 결과id: 점수 }`. 합이 가장 큰 결과. 동점이면 `results` 앞쪽 우선 |
| `score` | "몇 점/몇 도/몇 %?" 등급형 | 선택지마다 `score`. 결과마다 `minScore`~`maxScore` 구간(양 끝 포함), 빈틈·겹침 없이 전 범위를 덮어야 함 |

## 3. 분량 기준

- 문항 **8~12개** (허용 6~20). 선택지 **2~4개**. 1문항 ≈ 8초.
- 결과 **4~8개** (허용 3~12).
- 검증기 무작위 시뮬레이션에서 **모든 결과 3%~40%** 가 목표. 벗어나면 가중치를 조정.
  - `type` 모델 팁: 각 결과가 받는 가중치 총량(모든 문항·선택지 합)을 비슷하게 맞춘다. 동점 우선순위 때문에 `results` 앞쪽이 유리하니, 앞쪽 결과의 가중치를 살짝 줄여 보정한다.
  - `score` 모델 팁: 무작위 응답 총점은 중앙에 몰린다(정규분포). 양 끝 구간을 넓게, 가운데 구간을 좁게 잡는다.

## 4. 콘텐츠 품질 규칙

- **공유 욕구가 핵심**: 결과 이름은 짧고 캐릭터성 있게 (예: '100℃ 끓는점형'). `tagline`은 카톡 미리보기에 그대로 뜬다.
- **모든 결과가 기분 좋게**: 단점은 '주의할 점'으로 부드럽게. 어느 결과가 나와도 공유하고 싶어야 한다.
- **문항은 상황형**: "나는 외향적이다" 대신 "금요일 저녁 갑자기 약속이 취소됐다. 나는?"
- 말투: 해요체, 이모지는 결과 이름 옆 1개 정도.
- **금지**: 의학·임상 진단처럼 보이는 표현("~장애", "~증 진단"), 특정 집단 비하, 자해·우울 등 민감 주제 희화화, 실존 인물·브랜드.
- **경쟁 사이트 문항·결과 문구·이미지 복제 금지** — 구조나 아이디어만 참고하고 문장은 새로 쓴다.
- UI·공유 문구에 "진단 아님" 류 문구를 넣지 않는다 (brain decisions 2026-07-03 결정: 바이럴 톤 유지, 법적 문장은 약관에만).

## 5. 자동으로 붙는 것

소개 `/t/<slug>` · 문항 `/t/<slug>/quiz` · 결과 `/t/<slug>/r/<id>` (전부 정적 생성) · OG 이미지 `/api/og/t/<slug>[?r=<id>]` ·
홈 목록(14일간 '신규' 배지) · 카테고리 모음 페이지 `/c/<category>`(테스트가 생기면 자동 생성) · sitemap · 카카오 공유/링크 복사/이미지 저장 · 애드핏 · GA 이벤트
(`test_start`, `test_complete`, `share_kakao`, `share_link`, `save_image`, `retake`, `try_from_share` — 파라미터 `test_slug`, `result_id`)

## 6. 검사 명령

```bash
npm run validate:tests -- <slug>      # 구조 + 분포 시뮬레이션
npm run check                         # 검증 + tsc + 엔진 lint + next build
npm run smoke -- <baseUrl> <slug>     # 실행 중인 서버 실제 요청 (로컬/운영)
```

## 7. 검색 노출 (SEO) 필수 항목

검색 상위 노출은 보장할 수 없지만, 페이지 안에서 할 수 있는 건 전부 채운다. 검증기가 빠진 항목을 WARN으로 알려준다.

- `seo.keywords[0]` = **노릴 핵심 검색어** (실제 사람들이 치는 말, 예: '퇴사 테스트'). 나머지는 변형 검색어.
- `seo.title`은 핵심 검색어로 **시작**, `seo.description` 앞 40자 안에 핵심 검색어, `seo.h1`에 핵심 검색어 그대로.
- `guide`: 해설 섹션 2~3개, 합계 **500자 이상**. 테스트 활용법 + 그 주제에서 실제로 도움이 되는 정보. 키워드 반복 나열 금지, 사실 정보는 확실한 일반 원칙만 (법·의료 단정 금지).
- `faq`: 3~5개. 실제로 궁금해할 질문. FAQPage 구조화 데이터로 자동 출력.
- 엔진이 자동으로 붙이는 것: 결과 유형 목록(본문 텍스트), 경로 탐색(BreadcrumbList), 카테고리 내부 링크.
- **기존 테스트 내용을 고치면 `updatedAt`을 그날로 바꾼다.** sitemap lastmod가 이 값을 쓴다 (배포 시각을 쓰면 검색엔진이 lastmod를 무시하게 됨). 홈·카테고리 화면 자체를 고치면 `src/app/sitemap.ts`의 `SITE_SHELL_UPDATED`, 개인정보처리방침은 `PRIVACY_UPDATED`를 갱신.
- 출시 후 사람 손이 필요한 것: 구글 서치콘솔 URL 색인 요청, 네이버 서치어드바이저 웹페이지 수집 요청, 커뮤니티·블로그 소개 글(백링크).
