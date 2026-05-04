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
      { id: 1, text: '이 사람과 다시 만나고 싶다는 생각이 자연스럽게 드는가?', reverse: false },
      { id: 2, text: '이 사람과 단둘이 시간을 보내는 것이 기대되는가?', reverse: false },
      { id: 3, text: '외적 매력이 내 기준에서 충분히 형성되는가?', reverse: false },
      { id: 4, text: '신체적 친밀감(손잡기, 포옹, 스킨십 등)에 대한 거부감이 없는가?', reverse: false },
      { id: 5, text: '만남 후 "굳이 또 안 봐도 되겠다"는 생각이 드는가?', reverse: true },
    ],
  },
  {
    id: 'B',
    title: '대화 적합도',
    subtitle: 'Communication Fit',
    questions: [
      { id: 6, text: '대화가 억지로 이어지는 느낌 없이 자연스럽게 흐르는가?', reverse: false },
      { id: 7, text: '침묵이 어색하지 않은가?', reverse: false },
      { id: 8, text: '대화 후 정신적으로 피곤함보다 만족감이 큰가?', reverse: false },
      { id: 9, text: '내 의견을 끝까지 듣고 반응하는가?', reverse: false },
      { id: 10, text: '대화 중 자주 답답함을 느끼는가?', reverse: true },
    ],
  },
  {
    id: 'C',
    title: '감정적 안정성 적합도',
    subtitle: 'Emotional Stability Fit',
    questions: [
      { id: 11, text: '감정 기복이 과도하지 않은가?', reverse: false },
      { id: 12, text: '불편한 상황에서도 감정을 통제할 수 있는가?', reverse: false },
      { id: 13, text: '갈등 상황에서 대화가 가능한가?', reverse: false },
      { id: 14, text: '감정 표현 방식이 나와 크게 충돌하지 않는가?', reverse: false },
      { id: 15, text: '작은 문제도 큰 감정 싸움으로 번지는가?', reverse: true },
    ],
  },
  {
    id: 'D',
    title: '가치관 적합도',
    subtitle: 'Value Fit',
    questions: [
      { id: 16, text: '돈에 대한 관점(소비, 저축)이 크게 충돌하지 않는가?', reverse: false },
      { id: 17, text: '삶의 우선순위(일, 가족, 자기계발)가 유사한가?', reverse: false },
      { id: 18, text: '결혼/출산에 대한 방향성이 양립 가능한가?', reverse: false },
      { id: 19, text: '도덕적 기준(정직, 책임감)이 유사한가?', reverse: false },
      { id: 20, text: '중요한 가치 판단에서 자주 충돌하는가?', reverse: true },
    ],
  },
  {
    id: 'E',
    title: '생활 적합도',
    subtitle: 'Lifestyle Fit',
    questions: [
      { id: 21, text: '생활 리듬(수면, 활동 시간)이 크게 어긋나지 않는가?', reverse: false },
      { id: 22, text: '소비 습관이 감당 가능한 수준인가?', reverse: false },
      { id: 23, text: '개인 시간에 대한 기준이 맞는가?', reverse: false },
      { id: 24, text: '정리정돈/위생 기준이 크게 다르지 않은가?', reverse: false },
      { id: 25, text: '일상 습관 차이로 스트레스가 자주 생기는가?', reverse: true },
    ],
  },
  {
    id: 'F',
    title: '신뢰 적합도',
    subtitle: 'Trust Fit',
    questions: [
      { id: 26, text: '말과 행동이 일치하는가?', reverse: false },
      { id: 27, text: '약속 시간/약속 내용을 안정적으로 지키는가?', reverse: false },
      { id: 28, text: '중요한 내용을 숨기지 않는가?', reverse: false },
      { id: 29, text: '문제가 생기면 회피하지 않고 마주하는가?', reverse: false },
      { id: 30, text: '신뢰가 흔들리는 행동이 반복되는가?', reverse: true },
    ],
  },
  {
    id: 'G',
    title: '관계 동역학 적합도',
    subtitle: 'Relational Dynamics',
    questions: [
      { id: 31, text: '갈등 후 회복이 가능한가?', reverse: false },
      { id: 32, text: '문제가 반복적으로 개선되는가?', reverse: false },
      { id: 33, text: '서로 타협 가능한 구조인가?', reverse: false },
      { id: 34, text: '함께 있을 때 관계 피로도가 낮은가?', reverse: false },
      { id: 35, text: '같은 갈등 패턴이 반복되는가?', reverse: true },
    ],
  },
  {
    id: 'H',
    title: '자기 상태 변화',
    subtitle: 'Self-State Effect',
    questions: [
      { id: 36, text: '이 사람을 만나고 삶의 질이 올라가는가?', reverse: false },
      { id: 37, text: '자존감이 유지되거나 높아지는가?', reverse: false },
      { id: 38, text: '내가 나답게 행동할 수 있는가?', reverse: false },
      { id: 39, text: '정신적 안정감이 증가하는가?', reverse: false },
      { id: 40, text: '이 사람과 시간을 보낸 후 정서적 피로나 소진감이 커지는가?', reverse: true },
    ],
  },
]

export const CUTOFF_QUESTIONS = [
  { id: 41, text: '반복적인 거짓말이 있는가?' },
  { id: 42, text: '나의 거절이나 요청을 반복적으로 무시하는가?' },
  { id: 43, text: '통제하려는 경향이 있는가?' },
  { id: 44, text: '화가 났을 때 폭언, 욕설, 위협적 발언 등을 하는가?' },
  { id: 45, text: '존중 부족이 반복되는가?' },
]

// 관계 단계 → 활성 섹션
export const ACTIVE_SECTIONS_BY_STAGE: Record<string, SectionId[]> = {
  first_meeting: ['A', 'B'],
  one_to_three_months: ['A', 'B', 'C', 'D', 'F'],
  three_months_plus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  six_months_plus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  one_year_plus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  cohabiting: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
}

export function getActiveSections(stage: string): SectionId[] {
  return ACTIVE_SECTIONS_BY_STAGE[stage] ?? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
}
