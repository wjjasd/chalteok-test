'use client'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Props {
  anxietyScore: number
  avoidanceScore: number
}

function CustomDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill="#0ea5e9" fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={7} fill="#0ea5e9" />
      <circle cx={cx} cy={cy} r={3} fill="white" />
    </g>
  )
}

export default function AttachmentChart({ anxietyScore, avoidanceScore }: Props) {
  const data = [{ x: anxietyScore, y: avoidanceScore }]

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 px-10 mb-1">
        <span>불안 낮음</span>
        <span className="font-medium text-gray-500">← 불안 축 →</span>
        <span>불안 높음</span>
      </div>
      <div className="flex gap-1 items-stretch">
        <div className="flex flex-col justify-between text-[10px] text-gray-400 py-2 pr-1 text-right leading-tight" style={{ width: 40 }}>
          <span>회피<br />높음</span>
          <span>회피<br />낮음</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" dataKey="x" domain={[6, 30]} hide />
            <YAxis type="number" dataKey="y" domain={[6, 30]} hide />

            {/* 4분면 배경 + 라벨 */}
            <ReferenceArea x1={6} x2={18} y1={18} y2={30} fill="transparent" stroke="none"
              label={{ value: '나만의 섬형', position: 'center', fontSize: 9, fill: '#0d9488', fontWeight: 600 }} />
            <ReferenceArea x1={18} x2={30} y1={18} y2={30} fill="transparent" stroke="none"
              label={{ value: '폭풍 속 바다형', position: 'center', fontSize: 9, fill: '#7c3aed', fontWeight: 600 }} />
            <ReferenceArea x1={6} x2={18} y1={6} y2={18} fill="transparent" stroke="none"
              label={{ value: '고요한 바다형', position: 'center', fontSize: 9, fill: '#0284c7', fontWeight: 600 }} />
            <ReferenceArea x1={18} x2={30} y1={6} y2={18} fill="transparent" stroke="none"
              label={{ value: '파도치는 바다형', position: 'center', fontSize: 9, fill: '#d97706', fontWeight: 600 }} />

            {/* 절단점 기준선 */}
            <ReferenceLine x={18} stroke="#d1d5db" strokeWidth={1.5} />
            <ReferenceLine y={18} stroke="#d1d5db" strokeWidth={1.5} />

            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null
                const point = payload[0].payload as { x: number; y: number }
                return (
                  <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-md">
                    <div>불안: <span className="font-bold">{point.x}</span></div>
                    <div>회피: <span className="font-bold">{point.y}</span></div>
                  </div>
                )
              }}
            />
            <Scatter
              data={data}
              shape={(props: unknown) => <CustomDot {...(props as { cx?: number; cy?: number })} />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
