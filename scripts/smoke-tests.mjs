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

console.log(failed ? `\n스모크 테스트 실패 ${failed}건` : '\n스모크 테스트 통과')
process.exit(failed ? 1 : 0)
