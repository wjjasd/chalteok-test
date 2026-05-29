import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { decodeShare } from '@/lib/share'
import { GRADE_CONFIG } from '@/lib/scoring'

export const runtime = 'edge'

const GRADE_BG: Record<string, string> = {
  S: '#dcfce7',
  A: '#dbeafe',
  B: '#fef9c3',
  C: '#ffedd5',
  D: '#fee2e2',
}

const GRADE_FG: Record<string, string> = {
  S: '#14532d',
  A: '#1e3a8a',
  B: '#713f12',
  C: '#7c2d12',
  D: '#7f1d1d',
}

export async function GET(request: NextRequest) {
  const d = request.nextUrl.searchParams.get('d')
  const payload = d ? decodeShare(d) : null

  const score = payload ? Math.round(payload.finalScore) : null
  const grade = payload?.grade ?? null
  const gradeLabel = grade ? (GRADE_CONFIG[grade]?.label ?? '') : ''
  const gradeBg = grade ? (GRADE_BG[grade] ?? '#f3f4f6') : '#f3f4f6'
  const gradeFg = grade ? (GRADE_FG[grade] ?? '#111827') : '#111827'

  const fontData = await fetch(
    'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm203Tq4JJWq209pU0DPdWuqxJFA4GNDCBYtw.0.woff2'
  ).then((r) => r.arrayBuffer())

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
          background: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)',
          fontFamily: 'Noto Sans KR',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 30, color: '#e11d48', fontWeight: 700, marginBottom: 32 }}>
          찰떡 궁합 테스트
        </div>

        {score !== null ? (
          <>
            <div
              style={{
                fontSize: 128,
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1,
                letterSpacing: '-4px',
              }}
            >
              {score}점
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 38,
                fontWeight: 700,
                color: gradeFg,
                backgroundColor: gradeBg,
                padding: '14px 40px',
                borderRadius: 20,
                display: 'flex',
              }}
            >
              {grade}등급 — {gradeLabel}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 60, fontWeight: 800, color: '#111827', textAlign: 'center' }}>
            나와 그 사람, 찰떡일까?
          </div>
        )}

        <div style={{ fontSize: 22, color: '#9ca3af', marginTop: 48 }}>
          chalteok.kro.kr
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans KR',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
