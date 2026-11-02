import type { TestDefinition, TestResult } from './types'

/** answers[i] = i번째 문항에서 고른 선택지 index */
export function scoreTest(test: TestDefinition, answers: number[]): TestResult {
  if (test.scoring === 'type') {
    const totals = new Map<string, number>(test.results.map((r) => [r.id, 0]))
    test.questions.forEach((q, i) => {
      const opt = q.options[answers[i]]
      if (!opt?.weights) return
      for (const [id, w] of Object.entries(opt.weights)) {
        totals.set(id, (totals.get(id) ?? 0) + (w ?? 0))
      }
    })
    let best = test.results[0]
    let bestScore = -Infinity
    for (const r of test.results) {
      const s = totals.get(r.id) ?? 0
      if (s > bestScore) {
        best = r
        bestScore = s
      }
    }
    return best
  }

  const total = test.questions.reduce((sum, q, i) => sum + (q.options[answers[i]]?.score ?? 0), 0)
  return (
    test.results.find((r) => total >= (r.minScore ?? -Infinity) && total <= (r.maxScore ?? Infinity)) ??
    test.results[test.results.length - 1]
  )
}

export function scoreRange(test: TestDefinition): { min: number; max: number } {
  let min = 0
  let max = 0
  for (const q of test.questions) {
    const scores = q.options.map((o) => o.score ?? 0)
    min += Math.min(...scores)
    max += Math.max(...scores)
  }
  return { min, max }
}

export function estimatedMinutes(test: TestDefinition): number {
  return Math.max(1, Math.round((test.questions.length * 8) / 60))
}
