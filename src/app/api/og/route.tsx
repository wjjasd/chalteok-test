import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const GRADE_BG: Record<string, string> = {
  S: '#dcfce7', A: '#dbeafe', B: '#fef9c3', C: '#ffedd5', D: '#fee2e2',
}
const GRADE_FG: Record<string, string> = {
  S: '#16a34a', A: '#2563eb', B: '#ca8a04', C: '#ea580c', D: '#dc2626',
}
const GRADE_LABEL_KO: Record<string, string> = {
  S: '높은 적합도', A: '양호한 적합도', B: '보통 적합도', C: '낮은 적합도', D: '부적합 신호',
}

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    // Chrome 49 UA → Google Fonts가 woff 형식 반환 (Satori가 woff2 미지원)
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&display=swap',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
        },
      }
    ).then((r) => r.text())

    const url = css.match(/src: url\((.+?)\)/)?.[1]
    if (!url) return null
    return await fetch(url).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
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
  const labelKo = grade ? (GRADE_LABEL_KO[grade] ?? '') : ''

  const fontData = await loadKoreanFont()
  const fonts = fontData
    ? [{ name: 'NotoSansKR', data: fontData, weight: 700 as const, style: 'normal' as const }]
    : []
  const fontFamily = fontData ? 'NotoSansKR' : 'sans-serif'

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
          fontFamily,
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#e11d48', marginBottom: 24 }}>
          찰떡 궁합 테스트
        </div>

        {score !== null ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', fontSize: 130, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#374151', marginBottom: 16, marginLeft: 8 }}>
                점
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
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: fg }}>
                {grade}등급
              </div>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: fg }}>
                {labelKo}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 50, fontWeight: 700, color: '#111827' }}>
            나와 그 사람, 찰떡일까?
          </div>
        )}

        <div style={{ display: 'flex', fontSize: 20, color: '#9ca3af', marginTop: 40 }}>
          chalteok.kro.kr
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    }
  )
}
