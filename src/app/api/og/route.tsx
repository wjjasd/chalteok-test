import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const GRADE_BG: Record<string, string> = {
  S: '#dcfce7', A: '#dbeafe', B: '#fef9c3', C: '#ffedd5', D: '#fee2e2',
}
const GRADE_FG: Record<string, string> = {
  S: '#16a34a', A: '#2563eb', B: '#ca8a04', C: '#ea580c', D: '#dc2626',
}
const GRADE_LABEL: Record<string, string> = {
  S: 'Perfect Match', A: 'Great Match', B: 'Good Match', C: 'Needs Work', D: 'Low Match',
}

export async function GET(request: NextRequest) {
  // ?s=<score>&g=<grade> 형식 (짧은 URL) 우선, 없으면 ?d= 레거시 지원
  const sp = request.nextUrl.searchParams
  let score: number | null = null
  let grade: string | null = null

  const sParam = sp.get('s')
  const gParam = sp.get('g')

  if (sParam && gParam) {
    const n = parseInt(sParam, 10)
    if (!isNaN(n) && ['S', 'A', 'B', 'C', 'D'].includes(gParam)) {
      score = n
      grade = gParam
    }
  } else {
    const d = sp.get('d')
    if (d) {
      try {
        const json = JSON.parse(decodeURIComponent(atob(d)))
        if (json && typeof json.finalScore === 'number' && json.grade) {
          score = Math.round(json.finalScore)
          grade = String(json.grade)
        }
      } catch {
        // invalid
      }
    }
  }

  const bg = grade ? (GRADE_BG[grade] ?? '#fff1f2') : '#fff1f2'
  const fg = grade ? (GRADE_FG[grade] ?? '#111827') : '#111827'
  const label = grade ? (GRADE_LABEL[grade] ?? '') : ''

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
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#e11d48', marginBottom: 24 }}>
          CHALTEOK MATCH TEST
        </div>

        {score !== null ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', fontSize: 130, fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#374151', marginBottom: 16, marginLeft: 8 }}>
                pts
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 24,
                backgroundColor: bg,
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 44,
                paddingRight: 44,
                borderRadius: 16,
              }}
            >
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: fg }}>
                {grade} GRADE
              </div>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 600, color: fg }}>
                {label}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, color: '#111827' }}>
            How Compatible Are You?
          </div>
        )}

        <div style={{ display: 'flex', fontSize: 20, color: '#9ca3af', marginTop: 40 }}>
          chalteok.kro.kr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
