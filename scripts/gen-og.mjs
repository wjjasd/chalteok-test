import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FONT_PATH = path.join(__dirname, '..', 'public', 'fonts', 'NotoSansKR-Bold.otf')
const OUT_DIR = path.join(__dirname, '..', 'public', 'og')

const fontData = fs.readFileSync(FONT_PATH)
fs.mkdirSync(OUT_DIR, { recursive: true })

const CONFIGS = {
  root: {
    bg1: '#fff1f2', bg2: '#fce7f3',
    content: null,
  },
  S: { bg1: '#f0fdf4', bg2: '#dcfce7', grade: 'S', label: '높은 적합도', tagBg: '#dcfce7', tagFg: '#16a34a' },
  A: { bg1: '#eff6ff', bg2: '#dbeafe', grade: 'A', label: '양호한 적합도', tagBg: '#dbeafe', tagFg: '#2563eb' },
  B: { bg1: '#fefce8', bg2: '#fef9c3', grade: 'B', label: '보통 적합도', tagBg: '#fef9c3', tagFg: '#ca8a04' },
  C: { bg1: '#fff7ed', bg2: '#ffedd5', grade: 'C', label: '낮은 적합도', tagBg: '#ffedd5', tagFg: '#ea580c' },
  D: { bg1: '#fff1f2', bg2: '#fee2e2', grade: 'D', label: '부적합 신호', tagBg: '#fee2e2', tagFg: '#dc2626' },
}

function makeElement(key, cfg) {
  const isRoot = key === 'root'

  const children = isRoot
    ? {
        type: 'div',
        props: {
          style: { display: 'flex', fontSize: 52, fontWeight: 700, color: '#111827', textAlign: 'center', lineHeight: 1.3 },
          children: '나와 그 사람, 찰떡일까?',
        },
      }
    : {
        type: 'div',
        props: {
          style: {
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: cfg.tagBg,
            paddingTop: 18, paddingBottom: 18, paddingLeft: 56, paddingRight: 56,
            borderRadius: 20,
          },
          children: [
            {
              type: 'div',
              props: {
                style: { display: 'flex', fontSize: 72, fontWeight: 700, color: cfg.tagFg, lineHeight: 1 },
                children: `${cfg.grade}등급`,
              },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex', fontSize: 28, fontWeight: 700, color: cfg.tagFg, marginTop: 10 },
                children: cfg.label,
              },
            },
          ],
        },
      }

  return {
    type: 'div',
    props: {
      style: {
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${cfg.bg1} 0%, ${cfg.bg2} 100%)`,
        fontFamily: 'NotoSansKR',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontSize: 30, fontWeight: 700, color: '#e11d48', marginBottom: 32 },
            children: '찰떡 궁합 테스트',
          },
        },
        children,
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontSize: 22, color: '#9ca3af', marginTop: 44 },
            children: 'chalteok.kro.kr',
          },
        },
      ],
    },
  }
}

for (const [key, cfg] of Object.entries(CONFIGS)) {
  const element = makeElement(key, cfg)

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'NotoSansKR', data: fontData, weight: 700, style: 'normal' }],
  })

  const outPath = path.join(OUT_DIR, `${key}.png`)
  await sharp(Buffer.from(svg)).png().toFile(outPath)
  console.log(`✓ ${key}.png`)
}

console.log('OG 이미지 생성 완료 →', OUT_DIR)
