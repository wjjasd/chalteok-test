import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getTest, TESTS } from '@/content/tests'
import { THEMES } from '@/lib/tests/themes'

export const dynamic = 'force-static'
export const dynamicParams = false

const COVER = 'cover'

// 빌드 시 전수 생성 (정적 export)
// /og/t/<slug>/cover.png   → 테스트 표지
// /og/t/<slug>/<id>.png    → 결과 카드 (카카오 공유·이미지 저장·OG에 공통 사용). 결과 id 'cover'는 예약어
export function generateStaticParams() {
  return TESTS.flatMap((t) => [COVER, ...t.results.map((r) => r.id)].map((id) => ({ slug: t.slug, image: `${id}.png` })))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; image: string }> }) {
  const { slug, image } = await params
  const test = getTest(slug)
  if (!test || !image.endsWith('.png')) return new Response('Not found', { status: 404 })

  const resultId = image.slice(0, -'.png'.length)
  const result = resultId === COVER ? undefined : test.results.find((r) => r.id === resultId)
  if (resultId !== COVER && !result) return new Response('Not found', { status: 404 })
  const hex = THEMES[test.theme].hex
  const font = await readFile(join(process.cwd(), 'public/fonts/NotoSansKR-Bold.otf'))

  const emoji = result?.emoji ?? test.emoji
  const name = result?.name ?? test.title
  const sub = result?.tagline ?? test.subtitle
  const label = result ? `찰떡 ${test.title}` : '찰떡 테스트'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: hex.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'NotoSansKR',
          padding: '48px',
        }}
      >
        <div style={{ color: hex.label, fontSize: 26, marginBottom: 24 }}>{label}</div>
        <div
          style={{
            background: hex.card,
            borderRadius: 24,
            padding: '40px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            maxWidth: 1000,
          }}
        >
          <div style={{ fontSize: 80 }}>{emoji}</div>
          <div style={{ fontSize: 48, color: hex.name, fontWeight: 700, textAlign: 'center' }}>{name}</div>
          <div style={{ fontSize: 24, color: '#6b7280', textAlign: 'center' }}>{sub}</div>
        </div>
        <div style={{ color: '#9ca3af', fontSize: 20, marginTop: 32 }}>chalteok.com</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'NotoSansKR', data: font, style: 'normal', weight: 700 }],
    }
  )
}
