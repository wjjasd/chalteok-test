import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { decodeShare } from '@/lib/share'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const d = request.nextUrl.searchParams.get('d')
  const payload = d ? decodeShare(d) : null
  const score = payload ? Math.round(payload.finalScore) : null
  const grade = payload?.grade ?? null

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
          background: score !== null ? '#fff1f2' : '#f0fdf4',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 900, color: '#111827' }}>
          {score !== null ? `${score} pts` : 'Chalteok Match Test'}
        </div>
        {grade !== null && (
          <div style={{ fontSize: 40, fontWeight: 700, color: '#e11d48', marginTop: 20 }}>
            {grade} GRADE
          </div>
        )}
        <div style={{ fontSize: 24, color: '#9ca3af', marginTop: 32 }}>
          chalteok.kro.kr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
