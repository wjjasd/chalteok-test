import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const d = request.nextUrl.searchParams.get('d')

  let scoreText = 'Chalteok Match Test'
  let gradeText = 'chalteok.kro.kr'

  if (d) {
    try {
      const json = JSON.parse(decodeURIComponent(atob(d)))
      if (json && typeof json.finalScore === 'number' && json.grade) {
        scoreText = `${Math.round(json.finalScore)} pts`
        gradeText = `${json.grade} GRADE`
      }
    } catch {
      // invalid payload, use defaults
    }
  }

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
          background: '#fff1f2',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 900, color: '#111827' }}>
          {scoreText}
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#e11d48', marginTop: 24 }}>
          {gradeText}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
