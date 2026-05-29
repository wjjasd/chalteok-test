export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

export interface Question {
  id: number
  text: string
  reverse: boolean
}

export interface Section {
  id: SectionId
  title: string
  subtitle: string
  questions: Question[]
}

export const SECTIONS: Section[] = [
  {
    id: 'A',
    title: '초기 끌림 적합도',
    subtitle: 'Attraction Fit',
    questions: [
      { id: 1, text: '그 분과 다시 만나고 싶다는 생각이 자연스럽게 드나요?', reverse: false },
      { id: 2, text: '그 분과 단둘이 시간을 보내는 것이 기대되나요?', reverse: false },
      { id: 3, text: '그 분은 당신의 기준에서 외적으로 매력적인가요?', reverse: false },
      { id: 4, text: '그 분과의 신체적 접촉이 자연스럽게 느껴지나요?', reverse: false },
      { id: 5, text: '만남 후 또 만나고 싶은 기대감이 남나요?', reverse: false },
    ],
  },
  {
    id: 'B',
    title: '대화 적합도',
    subtitle: 'Communication Fit',
    questions: [
      { id: 6, text: '대화가 억지로 이어지는 느낌 없이 자연스럽게 흐르나요?', reverse: false },
      { id: 7, text: '침묵이 편안하게 느껴지나요?', reverse: false },
      { id: 8, text: '대화 후 만족감을 느끼나요?', reverse: false },
      { id: 9, text: '그 분은 당신의 의견을 끝까지 듣고 반응하나요?', reverse: false },
      { id: 10, text: '대화할 때 잘 통한다는 느낌이 드나요?', reverse: false },
    ],
  },
  {
    id: 'C',
    title: '감정적 안정성 적합도',
    subtitle: 'Emotional Stability Fit',
    questions: [
      { id: 11, text: '그 분은 감정이 안정적인 편인가요?', reverse: false },
      { id: 12, text: '그 분은 불편한 상황에서도 감정을 통제할 수 있나요?', reverse: false },
      { id: 13, text: '그 분은 갈등 상황에서도 대화가 가능한가요?', reverse: false },
      { id: 14, text: '그 분의 감정 표현 방식이 당신과 잘 맞나요?', reverse: false },
      { id: 15, text: '작은 문제가 생겨도 감정 싸움 없이 넘어갈 수 있나요?', reverse: false },
    ],
  },
  {
    id: 'D',
    title: '가치관 적합도',
    subtitle: 'Value Fit',
    questions: [
      { id: 16, text: '돈에 대한 관점이 서로 잘 맞나요?', reverse: false },
      { id: 17, text: '두 분의 삶의 우선순위(일, 가족, 자기계발)가 잘 맞나요?', reverse: false },
      { id: 18, text: '결혼이나 출산에 대한 생각이 서로 맞나요?', reverse: false },
      { id: 19, text: '두 분의 도덕적 기준(정직, 책임감)이 잘 맞나요?', reverse: false },
      { id: 20, text: '중요한 가치 판단에서 서로 잘 맞나요?', reverse: false },
    ],
  },
  {
    id: 'E',
    title: '생활 적합도',
    subtitle: 'Lifestyle Fit',
    questions: [
      { id: 21, text: '두 분의 생활 리듬(수면, 활동 시간)이 잘 맞나요?', reverse: false },
      { id: 22, text: '그 분의 소비 습관은 감당 가능한 수준인가요?', reverse: false },
      { id: 23, text: '두 분의 개인 시간에 대한 기대치가 잘 맞나요?', reverse: false },
      { id: 24, text: '정리정돈과 위생 기준이 잘 맞나요?', reverse: false },
      { id: 25, text: '생활 습관의 차이를 서로 받아들이나요?', reverse: false },
    ],
  },
  {
    id: 'F',
    title: '신뢰 적합도',
    subtitle: 'Trust Fit',
    questions: [
      { id: 26, text: '그 분은 말과 행동이 일치하나요?', reverse: false },
      { id: 27, text: '그 분은 약속을 잘 지키나요?', reverse: false },
      { id: 28, text: '그 분은 중요한 내용을 솔직하게 공유하나요?', reverse: false },
      { id: 29, text: '그 분은 문제가 생기면 회피하지 않고 직면하나요?', reverse: false },
      { id: 30, text: '그 분에 대한 신뢰가 꾸준히 유지되나요?', reverse: false },
    ],
  },
  {
    id: 'G',
    title: '관계 동역학 적합도',
    subtitle: 'Relational Dynamics',
    questions: [
      { id: 31, text: '두 분은 갈등 후 회복이 가능한가요?', reverse: false },
      { id: 32, text: '두 분 사이의 문제가 점점 나아지고 있나요?', reverse: false },
      { id: 33, text: '서로 타협이 가능한가요?', reverse: false },
      { id: 34, text: '함께 있을 때 편안함을 느끼나요?', reverse: false },
      { id: 35, text: '갈등이 생겨도 전보다 나아지고 있나요?', reverse: false },
    ],
  },
  {
    id: 'H',
    title: '자기 상태 변화',
    subtitle: 'Self-State Effect',
    questions: [
      { id: 36, text: '그 분을 만나고 삶의 질이 올라가나요?', reverse: false },
      { id: 37, text: '자존감이 유지되거나 높아지나요?', reverse: false },
      { id: 38, text: '그 분 앞에서 있는 그대로의 당신으로 있을 수 있나요?', reverse: false },
      { id: 39, text: '그 분과 함께할 때 정신적으로 안정감을 느끼나요?', reverse: false },
      { id: 40, text: '그 분과 시간을 보낸 후 정서적으로 충전된 느낌이 드나요?', reverse: false },
    ],
  },
]

export const CUTOFF_QUESTIONS = [
  { id: 41, text: '그 분은 반복적으로 거짓말을 하나요?' },
  { id: 42, text: '그 분은 당신의 거절이나 요청을 반복적으로 무시하나요?' },
  { id: 43, text: '그 분은 당신을 통제하려는 경향이 있나요?' },
  { id: 44, text: '그 분은 화가 났을 때 폭언, 욕설, 위협적 발언 등을 하나요?' },
  { id: 45, text: '그 분이 당신을 존중하지 않는 행동이 반복되나요?' },
]

// 관계 단계 → 활성 섹션
export const ACTIVE_SECTIONS_BY_STAGE: Record<string, SectionId[]> = {
  first_meeting: ['A', 'B'],
  one_to_three_months: ['A', 'B', 'C', 'D', 'F'],
  three_to_six_months: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  three_months_plus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  six_months_plus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  one_year_plus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  cohabiting: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
}

export function getActiveSections(stage: string): SectionId[] {
  return ACTIVE_SECTIONS_BY_STAGE[stage] ?? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
}
