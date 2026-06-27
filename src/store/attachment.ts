import { create } from 'zustand'

interface AttachmentState {
  termsAgreed: boolean
  answers: Record<string, number>
  setTermsAgreed: (v: boolean) => void
  setAnswer: (id: string, value: number) => void
  reset: () => void
}

export const useAttachmentStore = create<AttachmentState>()((set) => ({
  termsAgreed: false,
  answers: {},

  setTermsAgreed: (v) => set({ termsAgreed: v }),

  setAnswer: (id, value) =>
    set((state) => ({ answers: { ...state.answers, [id]: value } })),

  reset: () => set({ termsAgreed: false, answers: {} }),
}))
