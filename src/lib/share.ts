import { SectionId } from './questions'
import { Grade } from './scoring'

export interface SharePayload {
  sectionPercents: Record<SectionId, number>
  weights: Record<SectionId, number>
  finalScore: number
  grade: Grade
  cutoffCount: number
  activeSections: SectionId[]
}

export function encodeShare(payload: SharePayload): string {
  return btoa(encodeURIComponent(JSON.stringify(payload)))
}

export function decodeShare(hash: string): SharePayload | null {
  try {
    const cleaned = hash.startsWith('#') ? hash.slice(1) : hash
    return JSON.parse(decodeURIComponent(atob(cleaned)))
  } catch {
    return null
  }
}
