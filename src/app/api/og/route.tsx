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
  S: '#16a34a',
  A: '#2563eb',
  B: '#ca8a04',
  C: '#ea580c',
  D: '#dc2626',
}

const GRADE_LABEL_EN: Record<string, string> = {
  S: 'Perfect Match',
  A: 'Great Match',
  B: 'Good Match',
  C: 'Needs Work',
  D: 'Low Match',
}

export async function GET(request: NextRequest) {
  const d = request.nextUrl.searchParams.get('d')
  const payload = d ? decodeShare(d) : null

  const score = payload ? Math.round(payload.finalScore) : null
  const grade = payload?.grade ?? null
  const gradeLabelKo = grade ? (GRADE_CONFIG[grade]?.label ?? '') : ''
  const gradeLabelEn = grade ? (GRADE_LABEL_EN[grade] ?? '') : ''
  const gradeBg = grade ? (GRADE_BG[grade] ?? '#f3f4f6') : '#f3f4f6'
  const gradeFg = grade ? (GRADE_FG[grade] ?? '#111827') : '#e11d48'

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
          padding: '60px',
        }}
      >
        {/* 서비스명 */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#e11d48',
            letterSpacing: '0.05em',
            marginBottom: 36,
            textTransform: 'uppercase',
          }}
        >
          CHALTEOK MATCH TEST
        </div>

        {score !== null ? (
          <>
            {/* 점수 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 140,
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: 1,
                  letterSpacing: '-6px',
                }}
              >
                {score}
              </div>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#374151' }}>
                pts
              </div>
            </div>

            {/* 등급 배지 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 28,
                backgroundColor: gradeBg,
                padding: '16px 48px',
                borderRadius: 20,
              }}
            >
              <div style={{ fontSize: 42, fontWeight: 900, color: gradeFg }}>
                {grade} GRADE
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: gradeFg, opacity: 0.8 }}>
                {gradeLabelEn}
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#111827',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            How Compatible Are You?
          </div>
        )}

        {/* 도메인 */}
        <div style={{ fontSize: 20, color: '#9ca3af', marginTop: 44 }}>
          chalteok.kro.kr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
