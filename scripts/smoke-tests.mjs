// 실행 중인 서버(로컬 또는 운영)에 대해 테스트 페이지를 실제로 요청해 확인한다.
// 사용: node scripts/smoke-tests.mjs <baseUrl> <slug>
//   예: npx wrangler pages dev out --port 8788 후 node scripts/smoke-tests.mjs http://localhost:8788 love-temperature
//       node scripts/smoke-tests.mjs https://chalteok.com love-temperature
// 헤더(CSP)·리다이렉트는 public/_headers·_redirects가 적용되는 환경(Cloudflare Pages, wrangler pages dev)에서만 통과한다.
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const [base, slug] = process.argv.slice(2)
if (!base || !slug) {
  console.error('사용: node scripts/smoke-tests.mjs <baseUrl> <slug>')
  process.exit(2)
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const test = (await import(pathToFileURL(join(root, 'src/content/tests', `${slug}.ts`)).href)).default
const origin = base.replace(/\/$/, '')

let failed = 0
async function check(path, { type = 'text/html', contains = [], status = 200 } = {}) {
  const url = origin + path
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const ct = res.headers.get('content-type') ?? ''
    const raw = type.startsWith('image') ? '' : await res.text()
    const body = raw.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    const missing = contains.filter((s) => !body.includes(s))
    const ok = res.status === status && ct.includes(type) && missing.length === 0
    console.log(`${ok ? '✔' : '✖'} ${res.status} ${path}${missing.length ? `  (본문에 없음: ${missing.join(', ')})` : ''}${ct.includes(type) ? '' : `  (content-type: ${ct})`}`)
    if (!ok) failed++
  } catch (e) {
    console.log(`✖ ERR ${path}  ${e.message}`)
    failed++
  }
}

async function checkRedirect(path, to) {
  try {
    const res = await fetch(origin + path, { redirect: 'manual' })
    const loc = res.headers.get('location') ?? ''
    const ok = res.status === 301 && loc.replace(origin, '').split('?')[0] === to
    console.log(`${ok ? '✔' : '✖'} ${res.status} ${path} → ${loc || '(location 없음)'}`)
    if (!ok) failed++
  } catch (e) {
    console.log(`✖ ERR ${path}  ${e.message}`)
    failed++
  }
}

// 주요 페이지
await check('/', { contains: [test.title] })
for (const p of ['/attachment', '/bond', '/bond/section/a', '/bond/section/h', '/bond/result', '/privacy', `/c/${test.category}`]) await check(p)
await check(`/t/${slug}`, { contains: [test.title, test.subtitle, `/og/t/${slug}/cover.png`] })
await check(`/t/${slug}/quiz`, { contains: [test.questions[0].text] })
for (const r of test.results) {
  await check(`/t/${slug}/r/${r.id}`, { contains: [r.name, r.tagline, `/og/t/${slug}/${r.id}.png`] })
}
await check('/no-such-page-404', { status: 404 })

// OG 이미지 (빌드 시 생성한 정적 PNG)
await check('/og/site.png', { type: 'image/png' })
await check(`/og/t/${slug}/cover.png`, { type: 'image/png' })
for (const r of test.results) await check(`/og/t/${slug}/${r.id}.png`, { type: 'image/png' })
await check('/og/attachment/calm-sea.png', { type: 'image/png' })
await check('/apple-icon.png', { type: 'image/png' })
await check('/sitemap.xml', { type: 'xml', contains: [`/t/${slug}`] })
await check('/robots.txt', { type: 'text/plain', contains: ['Sitemap: https://chalteok.com/sitemap.xml'] })

// 옛 런타임 OG 경로 → 정적 PNG (public/_redirects). 이미 공유된 카드 호환
await checkRedirect('/api/og/site', '/og/site.png')
await checkRedirect(`/api/og/t/${slug}`, `/og/t/${slug}/cover.png`)
await checkRedirect('/api/og/attachment', '/og/site.png')

// CSP 회귀 방지: 외부 연동(카카오 공유·SDK·광고, GA)이 쓰는 출처가 헤더에서 빠지면 실패.
// 2026-11-02 사고: form-action 'self'가 카카오 공유 팝업의 sharer.kakao.com POST를 막아 공유 창이 빈 화면으로 뜸.
const CSP_REQUIRED = {
  'form-action': ['https://*.kakao.com'],
  'script-src': ['https://t1.kakaocdn.net', 'https://www.googletagmanager.com'],
  'connect-src': ['https://*.kakao.com', 'https://*.google-analytics.com'],
  'frame-src': ['https://*.kakao.com'],
}
const HEADERS_REQUIRED = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
}
try {
  const res = await fetch(origin + `/t/${slug}`)
  const csp = res.headers.get('content-security-policy') ?? ''
  const directives = Object.fromEntries(
    csp.split(';').map((d) => d.trim().split(/\s+/)).filter((p) => p[0]).map(([k, ...v]) => [k, v])
  )
  const missing = Object.entries(CSP_REQUIRED).flatMap(([dir, srcs]) =>
    srcs.filter((s) => !(directives[dir] ?? []).includes(s)).map((s) => `${dir} ${s}`)
  )
  if (!csp) {
    console.log('✖ CSP 헤더 없음')
    failed++
  } else if (missing.length) {
    console.log(`✖ CSP 필수 출처 누락: ${missing.join(', ')}`)
    failed++
  } else console.log('✔ CSP 필수 출처 (카카오 공유·SDK·광고·GA)')
  if (directives['script-src']?.includes("'unsafe-eval'")) {
    console.log("✖ CSP script-src에 'unsafe-eval' (개발용 값이 운영에 들어감)")
    failed++
  }
  const wrong = Object.entries(HEADERS_REQUIRED).filter(([k, v]) => res.headers.get(k) !== v)
  if (wrong.length) {
    console.log(`✖ 보안 헤더 누락/불일치: ${wrong.map(([k]) => `${k}=${res.headers.get(k)}`).join(', ')}`)
    failed++
  } else console.log('✔ 보안 헤더 (X-Frame-Options·nosniff·Referrer-Policy)')
} catch (e) {
  console.log(`✖ ERR 헤더 검사  ${e.message}`)
  failed++
}

console.log(failed ? `\n스모크 테스트 실패 ${failed}건` : '\n스모크 테스트 통과')
process.exit(failed ? 1 : 0)
