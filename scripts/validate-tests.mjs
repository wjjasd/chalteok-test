// 테스트 콘텐츠 검증기: 구조 검사 + 무작위 응답 시뮬레이션으로 결과 분포 확인.
// 사용: npm run validate:tests [-- <slug>]
// Node 22.18+/24의 타입 스트리핑으로 .ts 콘텐츠 파일을 직접 import 한다.
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(root, 'src/content/tests')
const { scoreTest, scoreRange } = await import(pathToFileURL(join(root, 'src/lib/tests/scoring.ts')).href)

const THEMES = ['rose', 'sky', 'violet', 'amber', 'emerald', 'pink', 'indigo', 'teal']
const CATEGORIES = ['love', 'personality', 'friend', 'life']
const ID_RE = /^[a-z0-9-]+$/
const RUNS = 20000

const only = process.argv[2]
const registry = readFileSync(join(contentDir, 'index.ts'), 'utf8')
const files = readdirSync(contentDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.startsWith('_'))
const targets = only ? files.filter((f) => f === `${only}.ts`) : files

if (only && targets.length === 0) {
  console.error(`✖ src/content/tests/${only}.ts 파일이 없습니다`)
  process.exit(1)
}

let failed = false

for (const file of targets) {
  const errors = []
  const warns = []
  const err = (m) => errors.push(m)
  const warn = (m) => warns.push(m)
  const slug = file.replace(/\.ts$/, '')

  let test
  try {
    test = (await import(pathToFileURL(join(contentDir, file)).href)).default
  } catch (e) {
    console.error(`✖ ${file}: import 실패 — ${e.message}`)
    failed = true
    continue
  }
  if (!test) {
    console.error(`✖ ${file}: default export 없음`)
    failed = true
    continue
  }

  // ── 메타 ──
  if (test.slug !== slug) err(`slug(${test.slug})가 파일명(${slug})과 다름`)
  if (!ID_RE.test(test.slug ?? '')) err('slug는 영문 소문자·숫자·하이픈만')
  for (const k of ['title', 'subtitle', 'intro', 'emoji', 'shareTitle']) if (!test[k]?.trim?.()) err(`${k} 비어 있음`)
  if (!THEMES.includes(test.theme)) err(`theme '${test.theme}' 은 ${THEMES.join('/')} 중 하나여야 함`)
  if (!CATEGORIES.includes(test.category)) err(`category '${test.category}' 은 ${CATEGORIES.join('/')} 중 하나여야 함`)
  if (!['type', 'score'].includes(test.scoring)) err(`scoring은 type/score 중 하나`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(test.publishedAt ?? '')) err('publishedAt은 YYYY-MM-DD')
  if (test.updatedAt !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(test.updatedAt)) err('updatedAt은 YYYY-MM-DD')
    else if (test.updatedAt < test.publishedAt) err('updatedAt이 publishedAt보다 이름')
  }
  if (!test.shareTitle?.includes('{name}')) err('shareTitle에 {name} 치환자가 없음')
  if (!test.seo?.title || !test.seo?.description) err('seo.title / seo.description 필요')
  else {
    if (test.seo.title.length > 60) warn(`seo.title ${test.seo.title.length}자 (60자 이내 권장)`)
    if (test.seo.description.length < 50 || test.seo.description.length > 160)
      warn(`seo.description ${test.seo.description.length}자 (50~160자 권장)`)
  }
  if (!registry.includes(`'./${slug}'`)) err(`src/content/tests/index.ts에 등록되지 않음`)

  // ── 검색 노출 (SEO) ──
  const kw = test.seo?.keywords?.[0]
  if (!kw) warn('seo.keywords 없음 — 첫 번째 값이 노릴 핵심 검색어')
  else {
    if (!test.seo.title?.startsWith(kw)) warn(`seo.title이 핵심 검색어 '${kw}'로 시작하지 않음`)
    if (!(test.seo.h1 ?? test.title).includes(kw)) warn(`h1에 핵심 검색어 '${kw}' 없음 (seo.h1 지정 권장)`)
    if (!test.seo.description?.slice(0, 40).includes(kw)) warn(`seo.description 앞부분(40자)에 '${kw}' 없음`)
  }
  const guideChars = (test.guide ?? []).flatMap((g) => g.body).join('').length
  if (guideChars < 500) warn(`guide 본문 ${guideChars}자 (검색 노출용 해설 500자 이상 권장)`)
  if ((test.faq?.length ?? 0) < 3) warn(`faq ${test.faq?.length ?? 0}개 (3~5개 권장)`)
  if (/진단/.test(JSON.stringify(test))) warn("'진단' 단어 사용 (2026-07-03 결정: UI·공유 문구에 쓰지 않음)")

  // ── 결과 ──
  const results = test.results ?? []
  const ids = new Set(results.map((r) => r.id))
  if (results.length < 3 || results.length > 12) err(`결과 ${results.length}개 (3~12개)`)
  if (ids.size !== results.length) err('결과 id 중복')
  for (const r of results) {
    const at = `결과 '${r.id}'`
    if (!ID_RE.test(r.id ?? '')) err(`${at}: id는 영문 소문자·숫자·하이픈만`)
    for (const k of ['name', 'emoji', 'tagline', 'description', 'advice']) if (!r[k]?.trim?.()) err(`${at}: ${k} 비어 있음`)
    if ((r.description?.length ?? 0) < 60) warn(`${at}: description이 짧음 (${r.description?.length ?? 0}자)`)
    if (!Array.isArray(r.traits) || r.traits.length < 3 || r.traits.length > 5) err(`${at}: traits 3~5개`)
    for (const k of ['bestMatch', 'worstMatch']) {
      if (r[k] !== undefined && (!ids.has(r[k]) || r[k] === r.id)) err(`${at}: ${k} '${r[k]}' 가 유효한 다른 결과 id가 아님`)
    }
  }

  // ── 문항 ──
  const questions = test.questions ?? []
  if (questions.length < 6 || questions.length > 20) err(`문항 ${questions.length}개 (6~20개)`)
  if (new Set(questions.map((q) => q.id)).size !== questions.length) err('문항 id 중복')
  for (const q of questions) {
    const at = `문항 '${q.id}'`
    if (!q.text?.trim()) err(`${at}: text 비어 있음`)
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) err(`${at}: 선택지 2~5개`)
    for (const [i, o] of (q.options ?? []).entries()) {
      if (!o.label?.trim()) err(`${at} 선택지 ${i + 1}: label 비어 있음`)
      if (test.scoring === 'type') {
        const keys = Object.keys(o.weights ?? {})
        if (keys.length === 0) err(`${at} 선택지 ${i + 1}: weights 없음`)
        for (const k of keys) {
          if (!ids.has(k)) err(`${at} 선택지 ${i + 1}: weights의 '${k}' 는 없는 결과 id`)
          if (!(o.weights[k] > 0)) err(`${at} 선택지 ${i + 1}: weights 값은 양수`)
        }
      } else if (typeof o.score !== 'number') err(`${at} 선택지 ${i + 1}: score 없음`)
    }
  }

  // ── 점수 구간 (score 모델) ──
  if (test.scoring === 'score' && errors.length === 0) {
    const { min, max } = scoreRange(test)
    const sorted = [...results].sort((a, b) => a.minScore - b.minScore)
    if (sorted.some((r) => typeof r.minScore !== 'number' || typeof r.maxScore !== 'number')) err('모든 결과에 minScore/maxScore 필요')
    else {
      if (sorted[0].minScore > min) err(`최저점 ${min}을 덮는 구간이 없음`)
      if (sorted.at(-1).maxScore < max) err(`최고점 ${max}을 덮는 구간이 없음`)
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].minScore !== sorted[i - 1].maxScore + 1)
          err(`구간 '${sorted[i - 1].id}'(~${sorted[i - 1].maxScore}) → '${sorted[i].id}'(${sorted[i].minScore}~) 사이 빈틈/겹침`)
      }
    }
  }

  // ── 시뮬레이션 ──
  let dist = null
  if (errors.length === 0) {
    dist = new Map(results.map((r) => [r.id, 0]))
    for (let n = 0; n < RUNS; n++) {
      const answers = questions.map((q) => Math.floor(Math.random() * q.options.length))
      const r = scoreTest(test, answers)
      dist.set(r.id, dist.get(r.id) + 1)
    }
    for (const [id, c] of dist) {
      const p = c / RUNS
      if (c === 0) err(`결과 '${id}' 가 무작위 ${RUNS}회 중 한 번도 안 나옴 (도달 불가 의심)`)
      else if (p < 0.03) warn(`결과 '${id}' 비율 ${(p * 100).toFixed(1)}% (3% 미만 — 너무 희귀)`)
      else if (p > 0.4) warn(`결과 '${id}' 비율 ${(p * 100).toFixed(1)}% (40% 초과 — 쏠림)`)
    }
  }

  // ── 출력 ──
  const mark = errors.length ? '✖' : warns.length ? '△' : '✔'
  console.log(`\n${mark} ${slug} — ${test.title ?? ''} (${questions.length}문항, 결과 ${results.length}개, ${test.scoring})`)
  if (dist) {
    for (const r of results) {
      const p = (dist.get(r.id) / RUNS) * 100
      console.log(`   ${r.emoji} ${r.name.padEnd(14)} ${p.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(p / 2))}`)
    }
  }
  for (const e of errors) console.log(`   ERROR  ${e}`)
  for (const w of warns) console.log(`   WARN   ${w}`)
  if (errors.length) failed = true
}

if (targets.length === 0) console.log('검증할 테스트가 없습니다 (src/content/tests/*.ts)')
console.log(failed ? '\n검증 실패' : '\n검증 통과')
process.exit(failed ? 1 : 0)
