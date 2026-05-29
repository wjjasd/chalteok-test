import { create } from 'zustand'
import { SectionId } from '@/lib/questions'
import { recommendWeights } from '@/lib/scoring'

export interface Profile {
  ageGroup: string
  gender: string
  relationshipStage: string
  pastRelationships: string
  importantValues: string[]
  emotionalState: string
  conflictFrequency: string
}

const DEFAULT_WEIGHTS: Record<SectionId, number> = {
  A: 12, B: 13, C: 12, D: 13, E: 12, F: 13, G: 13, H: 12,
}

interface QuizState {
  termsAgreed: boolean
  profile: Profile
  weights: Record<SectionId, number>
  answers: Record<string, number | boolean>

  setTermsAgreed: (v: boolean) => void
  setProfile: (p: Partial<Profile>) => void
  setWeight: (section: SectionId, value: number) => void
  setWeights: (w: Record<SectionId, number>) => void
  resetWeights: () => void
  applyRecommendedWeights: () => void
  setAnswer: (key: string, value: number | boolean) => void
  reset: () => void
}

const initialProfile: Profile = {
  ageGroup: '',
  gender: '',
  relationshipStage: '',
  pastRelationships: '',
  importantValues: [],
  emotionalState: '',
  conflictFrequency: '',
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  termsAgreed: false,
  profile: initialProfile,
  weights: { ...DEFAULT_WEIGHTS },
  answers: {},

  setTermsAgreed: (v) => set({ termsAgreed: v }),

  setProfile: (p) =>
    set((state) => ({ profile: { ...state.profile, ...p } })),

  setWeight: (section, value) =>
    set((state) => ({
      weights: { ...state.weights, [section]: value },
    })),

  setWeights: (w) => set({ weights: w }),

  resetWeights: () => set({ weights: { ...DEFAULT_WEIGHTS } }),

  applyRecommendedWeights: () => {
    const { profile } = get()
    const recommended = recommendWeights(profile.importantValues)
    set({ weights: recommended })
  },

  setAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),

  reset: () =>
    set({
      termsAgreed: false,
      profile: initialProfile,
      weights: { ...DEFAULT_WEIGHTS },
      answers: {},
    }),
}))
