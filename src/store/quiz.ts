import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'chalteok-bond-quiz',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// sessionStorage 복원(rehydrate)은 비동기라, 마운트 직후 스토어를 읽으면
// 아직 기본값(빈 answers/profile)일 수 있다. 결과 화면처럼 복원 완료 여부에
// 따라 리다이렉트 등 분기를 타는 곳에서 이 훅으로 완료 시점을 기다린다.
export function useQuizStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useQuizStore.persist.onFinishHydration(onChange),
    () => useQuizStore.persist.hasHydrated(),
    () => false,
  )
}
