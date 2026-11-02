import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getTest } from '@/content/tests'
import { THEMES } from '@/lib/tests/themes'

// /api/og/t/<slug>          → 테스트 표지
// /api/og/t/<slug>?r=<id>   → 결과 카드 (카카오 공유·이미지 저장·OG에 공통 사용)
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const test = getTest(slug)
  if (!test) return new Response('Not found', { status: 404 })

  const resultId = new URL(request.url).searchParams.get('r')
  const result = test.results.find((r) => r.id === resultId)
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
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    }
  )
}
