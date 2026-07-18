import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { TYPE_CONFIG, type AttachmentType } from '@/lib/attachmentScoring'

export const dynamic = 'force-dynamic'

// satori(ImageResponse)는 Tailwind 클래스를 렌더링할 수 없어 TYPE_CONFIG의 색상 값을 재사용할 수 없다.
// name/emoji/tagline은 TYPE_CONFIG에서 가져오고, hex 색상만 OG 전용으로 별도 유지한다.
const OG_COLORS: Record<AttachmentType, {
  bg: string; cardBg: string; labelColor: string; nameColor: string
}> = {
  'calm-sea': { bg: '#e0f2fe', cardBg: '#f0f9ff', labelColor: '#0284c7', nameColor: '#0369a1' },
  'wavy-sea': { bg: '#fef3c7', cardBg: '#fffbeb', labelColor: '#d97706', nameColor: '#b45309' },
  'lone-island': { bg: '#ccfbf1', cardBg: '#f0fdfa', labelColor: '#0d9488', nameColor: '#0f766e' },
  'stormy-sea': { bg: '#f3e8ff', cardBg: '#faf5ff', labelColor: '#9333ea', nameColor: '#7e22ce' },
  'mirror-sea': { bg: '#e2e8f0', cardBg: '#f8fafc', labelColor: '#64748b', nameColor: '#334155' },
}

const VALID_TYPES = Object.keys(TYPE_CONFIG) as AttachmentType[]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const typeParam = searchParams.get('type') ?? 'calm-sea'
  const type: AttachmentType = VALID_TYPES.includes(typeParam as AttachmentType)
    ? (typeParam as AttachmentType)
    : 'calm-sea'

  const cfg = { ...TYPE_CONFIG[type], ...OG_COLORS[type] }
  const font = await readFile(join(process.cwd(), 'public/fonts/NotoSansKR-Bold.otf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: cfg.bg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'NotoSansKR',
          padding: '48px',
        }}
      >
        <div style={{ color: cfg.labelColor, fontSize: 22, marginBottom: 24, letterSpacing: 1 }}>
          찰떡 애착유형 테스트
        </div>

        <div
          style={{
            background: cfg.cardBg,
            borderRadius: 24,
            padding: '40px 64px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12,
          }}
        >
          <div style={{ fontSize: 72 }}>{cfg.emoji}</div>
          <div style={{ fontSize: 42, color: cfg.nameColor, fontWeight: 700 }}>{cfg.name}</div>
          <div style={{ fontSize: 22, color: '#6b7280' }}>{cfg.tagline}</div>
        </div>

        <div style={{ color: '#9ca3af', fontSize: 18, marginTop: 32 }}>chalteok.com</div>
      </div>
    ),
    {
      width: 1200, height: 630,
      fonts: [{ name: 'NotoSansKR', data: font, style: 'normal', weight: 700 }],
    }
  )
}
