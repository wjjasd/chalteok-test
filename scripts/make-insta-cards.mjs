// 인스타그램 카드(1080×1350) + 캡션 생성: 표지 1장 + 결과 유형 N장 + 마무리 1장.
// 사용: npm run insta-cards -- <slug> [출력폴더]
//   기본 출력: ~/Downloads/chalteok_insta_<slug>/  (card01.png … , caption.txt)
// 렌더링은 로컬 Chrome 헤드리스로 한다 (CHROME_PATH로 경로 지정 가능).
// 각 카드는 --dump-dom으로 내용 넘침(1350px 초과)을 검사하고, 넘치면 실패로 끝난다.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const [slug, outArg] = process.argv.slice(2)
if (!slug) {
  console.error('사용: npm run insta-cards -- <slug> [출력폴더]')
  process.exit(2)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const test = (await import(pathToFileURL(join(root, 'src/content/tests', `${slug}.ts`)).href)).default
const { THEMES } = await import(pathToFileURL(join(root, 'src/lib/tests/themes.ts')).href)

const CHROME =
  process.env.CHROME_PATH ??
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => existsSync(p))
if (!CHROME) {
  console.error('Chrome을 찾을 수 없습니다. CHROME_PATH 환경변수로 지정하세요.')
  process.exit(1)
}

const CATEGORY_LABEL = { love: '연애 심리테스트', personality: '성격 심리테스트', friend: '인간관계 심리테스트', life: '직장인 심리테스트' }
const W = 1080
const H = 1350
const hex = THEMES[test.theme].hex
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const n = test.results.length
const promo = test.promo ?? { headline: `${test.title}\n결과는?`, hashtags: ['심리테스트'] }

const css = `
html,body{margin:0;width:${W}px;min-height:${H}px}
body{font-family:'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',sans-serif;color:#111827;background:linear-gradient(160deg,${hex.bg} 0%,${hex.card} 45%,#ffffff 100%);display:flex;flex-direction:column;box-sizing:border-box;padding:90px 90px 70px;min-height:${H}px}
.emoji{font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif;line-height:1}
.top{display:flex;justify-content:space-between;align-items:center;font-size:34px;font-weight:700;color:${hex.name}}
.pill{background:${hex.name};color:#fff;border-radius:999px;padding:10px 28px;font-size:30px;white-space:nowrap}
.foot{margin-top:auto;padding-top:30px;display:flex;justify-content:space-between;align-items:center;font-size:30px;color:#6b7280;font-weight:600}
.card{background:#fff;border-radius:48px;box-shadow:0 12px 40px rgba(0,0,0,.08);padding:56px 64px 50px;margin-top:40px}
h1{margin:0;font-size:80px;font-weight:900;letter-spacing:-3px;line-height:1.2;word-break:keep-all}
.tag{font-size:38px;color:${hex.name};font-weight:700;margin-top:18px;line-height:1.4;word-break:keep-all}
ul{list-style:none;padding:0;margin:32px 0 0}
li{font-size:33px;line-height:1.45;color:#374151;margin-top:14px;display:flex;gap:18px;word-break:keep-all}
li b{color:${hex.label}}
.advice{margin-top:30px;background:${hex.card};border-radius:28px;padding:24px 32px;font-size:31px;line-height:1.5;color:${hex.name};word-break:keep-all}
`
// 넘침 감지: 문서 높이가 카드 높이를 넘으면 body에 표시 → --dump-dom으로 읽는다
const probe = `<script>addEventListener('load',()=>{document.body.setAttribute('data-overflow',document.documentElement.scrollHeight>${H}?'yes':'no')})</script>`
const page = (body) => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}${probe}</body></html>`
const foot = `<div class="foot"><span>🍡 찰떡 테스트</span><span>chalteok.com</span></div>`

const tile = n <= 4 ? 200 : n <= 8 ? 170 : 130
const cards = []
cards.push(
  page(`
<div class="top"><span>${esc(CATEGORY_LABEL[test.category] ?? '심리테스트')}</span><span class="pill">옆으로 넘기기 →</span></div>
<div style="margin-top:60px;font-size:46px;font-weight:700;color:${hex.name};word-break:keep-all">${esc(promo.hook ?? test.subtitle)}</div>
<h1 style="font-size:112px;margin-top:24px">${esc(promo.headline).replace(/\n/g, '<br>')}</h1>
<div style="display:flex;flex-wrap:wrap;gap:24px;margin-top:56px">${test.results
    .map(
      (r) =>
        `<div class="emoji" style="font-size:${Math.round(tile * 0.58)}px;background:#fff;border-radius:40px;width:${tile}px;height:${tile}px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.06)">${r.emoji}</div>`
    )
    .join('')}</div>
<div style="margin-top:48px;font-size:40px;color:#374151;line-height:1.5">${n}가지 유형 중 나는 몇 번일까?<br><b style="color:${hex.name}">댓글로 번호 남겨 주세요 👇</b></div>
${foot}`)
)
test.results.forEach((r, i) =>
  cards.push(
    page(`
<div class="top"><span>${esc(test.title)}</span><span class="pill">${i + 1} / ${n}</span></div>
<div class="card">
  <div class="emoji" style="font-size:130px">${r.emoji}</div>
  <h1 style="margin-top:26px">${esc(r.name)}</h1>
  <div class="tag">${esc(r.tagline)}</div>
  <ul>${r.traits
    .slice(0, 3)
    .map((t) => `<li><b>✓</b><span>${esc(t)}</span></li>`)
    .join('')}</ul>
  <div class="advice">💡 ${esc(r.advice)}</div>
</div>
${foot}`)
  )
)
cards.push(
  page(`
<div class="top"><span>${esc(test.title)}</span><span class="pill">나는 몇 번?</span></div>
<div style="margin:auto 0;text-align:center">
  <div class="emoji" style="font-size:200px">${test.emoji}</div>
  <h1 style="font-size:96px;margin-top:40px">헷갈린다면<br>1분 만에 확인!</h1>
  <div style="font-size:42px;color:#374151;margin-top:44px;line-height:1.6">${test.questions.length}개 질문 · 회원가입 없음 · 무료</div>
  <div style="display:inline-block;margin-top:60px;background:${hex.label};color:#fff;font-size:48px;font-weight:800;border-radius:999px;padding:34px 70px">프로필 링크에서 테스트하기</div>
  <div style="font-size:36px;color:#6b7280;margin-top:40px">친구 태그해서 같이 해보기 👥</div>
</div>
${foot}`)
)

const outDir = outArg ?? join(homedir(), 'Downloads', `chalteok_insta_${slug}`)
mkdirSync(outDir, { recursive: true })
const work = mkdtempSync(join(tmpdir(), `chalteok-cards-${slug}-`))
const chromeArgs = ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${W},${H}`, '--force-device-scale-factor=1']

let overflow = []
cards.forEach((html, i) => {
  const name = `card${String(i + 1).padStart(2, '0')}`
  const htmlPath = join(work, `${name}.html`)
  writeFileSync(htmlPath, html)
  const url = pathToFileURL(htmlPath).href
  const dom = execFileSync(CHROME, [...chromeArgs, '--dump-dom', url], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  if (!dom.includes('data-overflow="no"')) overflow.push(name)
  execFileSync(CHROME, [...chromeArgs, `--screenshot=${join(outDir, `${name}.png`)}`, url], { stdio: 'ignore' })
  console.log(`✔ ${name}.png`)
})

const caption = [
  `${promo.hook ?? test.subtitle}`,
  `나는 ${n}가지 중 몇 번인지 댓글로 알려주세요!`,
  '',
  `헷갈리면 프로필 링크에서 1분 테스트 🍡`,
  `친구 태그해서 같이 해보기 👥`,
  '',
  promo.hashtags.slice(0, 5).map((h) => `#${h.replace(/^#/, '')}`).join(' '), // 인스타 최대 5개
].join('\n')
writeFileSync(join(outDir, 'caption.txt'), caption + '\n', 'utf8')
rmSync(work, { recursive: true, force: true })

console.log(`\n출력: ${outDir} (카드 ${cards.length}장 + caption.txt)`)
if (overflow.length) {
  console.error(`✖ 내용 넘침: ${overflow.join(', ')} — 문구를 줄이거나 promo.headline 줄 수를 줄이세요`)
  process.exit(1)
}
console.log('인스타 카드 생성 완료')
