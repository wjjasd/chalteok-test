'use client'

interface ScoreGaugeProps {
  score: number
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score))
  // 반원 게이지: -180도(좌) ~ 0도(우)
  const angle = -180 + (clamped / 100) * 180
  const rad = (angle * Math.PI) / 180
  const cx = 120
  const cy = 110
  const r = 90

  const needleX = cx + r * Math.cos(rad)
  const needleY = cy + r * Math.sin(rad)

  // 그라디언트 색상 구간
  const zones = [
    { from: 0, to: 40, color: '#ef4444' },
    { from: 40, to: 55, color: '#f97316' },
    { from: 55, to: 70, color: '#eab308' },
    { from: 70, to: 85, color: '#3b82f6' },
    { from: 85, to: 100, color: '#22c55e' },
  ]

  function arcPath(startDeg: number, endDeg: number) {
    const toRad = (d: number) => ((d - 180) * Math.PI) / 180
    const s = toRad(startDeg)
    const e = toRad(endDeg)
    const x1 = cx + r * Math.cos(s)
    const y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e)
    const y2 = cy + r * Math.sin(e)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 145" className="w-full max-w-xs">
        {/* 배경 트랙 */}
        <path
          d={arcPath(0, 180)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* 색상 구간 */}
        {zones.map((z) => (
          <path
            key={z.from}
            d={arcPath(z.from * 1.8, z.to * 1.8)}
            fill="none"
            stroke={z.color}
            strokeWidth="14"
            strokeLinecap="butt"
            opacity="0.7"
          />
        ))}
        {/* 바늘 */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#1f2937"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6" fill="#1f2937" />
        {/* 점수 텍스트 */}
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="#111827"
        >
          {clamped.toFixed(1)}
        </text>
        {/* 범례 라벨 */}
        <text x="14" y="140" fontSize="9" fill="#9ca3af">0</text>
        <text x="218" y="140" fontSize="9" fill="#9ca3af" textAnchor="end">100</text>
      </svg>
    </div>
  )
}
