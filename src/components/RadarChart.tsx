'use client'

import {
  RadarChart as ReRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { SectionId } from '@/lib/questions'

const SECTION_LABELS: Record<SectionId, string> = {
  A: '초기 끌림',
  B: '대화',
  C: '감정',
  D: '가치관',
  E: '생활',
  F: '신뢰',
  G: '관계 흐름',
  H: '자기변화',
}

interface RadarChartProps {
  sectionPercents: Record<SectionId, number>
  activeSections: SectionId[]
}

export default function RadarChart({ sectionPercents, activeSections }: RadarChartProps) {
  const data = activeSections.map((id) => ({
    subject: SECTION_LABELS[id],
    value: Math.round(sectionPercents[id]),
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReRadar data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <Radar
          dataKey="value"
          stroke="#f43f5e"
          fill="#f43f5e"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </ReRadar>
    </ResponsiveContainer>
  )
}
