// 실행 중인 서버(로컬 또는 운영)에 대해 테스트 페이지를 실제로 요청해 확인한다.
// 사용: node scripts/smoke-tests.mjs <baseUrl> <slug>
//   예: node scripts/smoke-tests.mjs http://localhost:3100 love-temperature
//       node scripts/smoke-tests.mjs https://chalteok.com love-temperature
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const [base, slug] = process.argv.slice(2)
if (!base || !slug) {
  console.error('사용: node scripts/smoke-tests.mjs <baseUrl> <slug>')
  process.exit(2)
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const test = (await import(pathToFileURL(join(root, 'src/content/tests', `${slug}.ts`)).href)).default

let failed = 0
async function check(path, { type = 'text/html', contains = [] } = {}) {
  const url = base.replace(/\/$/, '') + path
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const ct = res.headers.get('content-type') ?? ''
    const raw = type.startsWith('image') ? '' : await res.text()
    const body = raw.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    const missing = contains.filter((s) => !body.includes(s))
    const ok = res.ok && ct.includes(type) && missing.length === 0
    console.log(`${ok ? '✔' : '✖'} ${res.status} ${path}${missing.length ? `  (본문에 없음: ${missing.join(', ')})` : ''}${ct.includes(type) ? '' : `  (content-type: ${ct})`}`)
    if (!ok) failed++
  } catch (e) {
    console.log(`✖ ERR ${path}  ${e.message}`)
    failed++
  }
}

await check('/', { contains: [test.title] })
await check(`/t/${slug}`, { contains: [test.title, test.subtitle, `/api/og/t/${slug}`] })
await check(`/t/${slug}/quiz`, { contains: [test.questions[0].text] })
for (const r of test.results) {
  await check(`/t/${slug}/r/${r.id}`, { contains: [r.name, r.tagline, `/api/og/t/${slug}?r=${r.id}`] })
}
await check(`/api/og/t/${slug}`, { type: 'image/png' })
await check(`/api/og/t/${slug}?r=${test.results[0].id}`, { type: 'image/png' })
await check('/sitemap.xml', { type: 'xml', contains: [`/t/${slug}`] })

// CSP 회귀 방지: 외부 연동(카카오 공유·SDK·광고, GA)이 쓰는 출처가 헤더에서 빠지면 실패.
// 2026-11-02 사고: form-action 'self'가 카카오 공유 팝업의 sharer.kakao.com POST를 막아 공유 창이 빈 화면으로 뜸.
const CSP_REQUIRED = {
  'form-action': ['https://*.kakao.com'],
  'script-src': ['https://developers.kakao.com', 'https://t1.kakaocdn.net', 'https://www.googletagmanager.com'],
  'connect-src': ['https://*.kakao.com', 'https://*.google-analytics.com'],
  'frame-src': ['https://*.kakao.com'],
}
try {
  const res = await fetch(base.replace(/\/$/, '') + `/t/${slug}`)
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
} catch (e) {
  console.log(`✖ ERR CSP 검사  ${e.message}`)
  failed++
}

console.log(failed ? `\n스모크 테스트 실패 ${failed}건` : '\n스모크 테스트 통과')
process.exit(failed ? 1 : 0)
