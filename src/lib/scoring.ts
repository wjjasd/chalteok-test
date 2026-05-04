import { SECTIONS, SectionId, getActiveSections } from './questions'

const REVERSE_QUESTIONS = new Set([5, 10, 15, 20, 25, 30, 35, 40])

export function scoreQuestion(qId: number, raw: number): number {
  return REVERSE_QUESTIONS.has(qId) ? 4 - raw : raw
}

export function calcSectionPercent(
  sectionId: SectionId,
  answers: Record<string, number>,
): number {
  const section = SECTIONS.find((s) => s.id === sectionId)!
  const sum = section.questions.reduce((acc, q) => {
    const raw = answers[`Q${q.id}`] ?? 0
    return acc + scoreQuestion(q.id, raw)
  }, 0)
  return (sum / 20) * 100
}

export function calcFinalScore(
  sectionPercents: Record<SectionId, number>,
  weights: Record<SectionId, number>,
  activeSections: SectionId[],
): number {
  const totalWeight = activeSections.reduce((acc, s) => acc + weights[s], 0)
  if (totalWeight === 0) return 0
  const weighted = activeSections.reduce(
    (acc, s) => acc + sectionPercents[s] * weights[s],
    0,
  )
  return weighted / totalWeight
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D'

export function getGrade(score: number): Grade {
  if (score >= 85) return 'S'
  if (score >= 70) return 'A'
  if (score >= 55) return 'B'
  if (score >= 40) return 'C'
  return 'D'
}

export const GRADE_CONFIG: Record<Grade, { label: string; color: string; bg: string; description: string }> = {
  S: {
    label: '높은 적합도',
    color: 'text-green-600',
    bg: 'bg-green-100',
    description: '현재 시점에서 높은 관계 적합도를 보이고 있습니다. 두 사람 사이의 연결이 여러 영역에서 잘 맞는 것으로 보입니다.',
  },
  A: {
    label: '양호한 적합도',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    description: '대체로 좋은 적합도를 보이고 있습니다. 일부 영역에서 대화와 조율이 도움이 될 수 있습니다.',
  },
  B: {
    label: '보통 적합도',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    description: '보통 수준의 적합도입니다. 강점 영역을 살리고 약점 영역에 대해 서로 이야기 나눠보는 것을 권합니다.',
  },
  C: {
    label: '낮은 적합도',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    description: '여러 영역에서 맞지 않는 부분이 있을 수 있습니다. 차이를 인식하고 솔직한 대화가 필요할 수 있습니다.',
  },
  D: {
    label: '부적합 신호',
    color: 'text-red-600',
    bg: 'bg-red-100',
    description: '현재 시점에서 많은 불일치 신호가 감지됩니다. 신뢰할 수 있는 주변인이나 전문 상담사와 상의해보길 권합니다.',
  },
}

export interface ScoreResult {
  sectionPercents: Record<SectionId, number>
  finalScore: number
  grade: Grade
  activeSections: SectionId[]
  cutoffCount: number
}

export function calcResult(
  answers: Record<string, number | boolean>,
  weights: Record<SectionId, number>,
  relationshipStage: string,
): ScoreResult {
  const activeSections = getActiveSections(relationshipStage)

  const sectionPercents = {} as Record<SectionId, number>
  for (const s of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as SectionId[]) {
    sectionPercents[s] = calcSectionPercent(s, answers as Record<string, number>)
  }

  const finalScore = calcFinalScore(sectionPercents, weights, activeSections)
  const grade = getGrade(finalScore)

  const cutoffCount = [41, 42, 43, 44, 45].filter((id) => answers[`Q${id}`] === true).length

  return { sectionPercents, finalScore, grade, activeSections, cutoffCount }
}

// P5 선택 → 가중치 자동 추천
export function recommendWeights(importantValues: string[]): Record<SectionId, number> {
  const base = 12.5
  const weights: Record<SectionId, number> = { A: base, B: base, C: base, D: base, E: base, F: base, G: base, H: base }

  const bonusMap: Record<string, { section: SectionId; bonus: number }[]> = {
    trust: [{ section: 'F', bonus: 8 }],
    communication: [{ section: 'B', bonus: 8 }],
    emotional_stability: [{ section: 'C', bonus: 5 }, { section: 'H', bonus: 5 }],
    values: [{ section: 'D', bonus: 8 }],
    lifestyle: [{ section: 'E', bonus: 8 }],
    attraction: [{ section: 'A', bonus: 8 }],
  }

  let totalBonus = 0
  const bonusApplied: Partial<Record<SectionId, number>> = {}

  for (const val of importantValues) {
    const entries = bonusMap[val] ?? []
    for (const { section, bonus } of entries) {
      bonusApplied[section] = (bonusApplied[section] ?? 0) + bonus
      totalBonus += bonus
    }
  }

  // 보너스 섹션에 추가
  for (const [s, b] of Object.entries(bonusApplied)) {
    weights[s as SectionId] += b
  }

  // 나머지 섹션에서 균등 차감
  const bonusSections = new Set(Object.keys(bonusApplied) as SectionId[])
  const otherSections = (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as SectionId[]).filter(
    (s) => !bonusSections.has(s),
  )
  if (otherSections.length > 0) {
    const deduct = totalBonus / otherSections.length
    for (const s of otherSections) {
      weights[s] = Math.max(5, weights[s] - deduct)
    }
  }

  // 정수 반올림 후 합계를 100으로 맞춤
  const rounded = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, Math.round(v)]),
  ) as Record<SectionId, number>
  const sum = Object.values(rounded).reduce((a, b) => a + b, 0)
  const diff = 100 - sum
  // diff 보정: 첫 번째 섹션에 가감
  rounded['A'] += diff

  return rounded
}
