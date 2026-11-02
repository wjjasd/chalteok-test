import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getCatalog } from '@/content/catalog'

// 사이트 대표 OG 이미지 (홈·카테고리·약관 등 개별 이미지가 없는 페이지 공용)
export async function GET() {
  const font = await readFile(join(process.cwd(), 'public/fonts/NotoSansKR-Bold.otf'))
  const emojis = getCatalog()
    .slice(0, 6)
    .map((i) => i.emoji)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f2 0%, #fdf4ff 50%, #ecfeff 100%)',
          fontFamily: 'NotoSansKR',
        }}
      >
        <div style={{ display: 'flex', gap: 20, fontSize: 72, marginBottom: 36 }}>
          {emojis.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: 120,
                height: 120,
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                borderRadius: 32,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              {e}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 30, color: '#f43f5e', marginBottom: 12 }}>🍡 찰떡 테스트</div>
        <div style={{ fontSize: 64, color: '#111827', fontWeight: 700 }}>1분이면 끝나는 무료 심리테스트</div>
        <div style={{ fontSize: 28, color: '#6b7280', marginTop: 16 }}>연애 · 성격 · 직장까지 · chalteok.com</div>
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
