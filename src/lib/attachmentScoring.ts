import { ATTACHMENT_QUESTIONS } from '@/data/attachmentQuestions'

export type AttachmentType = 'calm-sea' | 'wavy-sea' | 'lone-island' | 'stormy-sea' | 'mirror-sea'

export interface AttachmentResult {
  anxietyScore: number
  avoidanceScore: number
  type: AttachmentType
}

export interface AttachmentTypeConfig {
  name: string
  emoji: string
  tagline: string
  description: string
  color: string
  bg: string
  borderColor: string
}

export const TYPE_CONFIG: Record<AttachmentType, AttachmentTypeConfig> = {
  'calm-sea': {
    name: '고요한 바다형',
    emoji: '🌊',
    tagline: '안정적이고 신뢰하는 관계 패턴',
    description:
      '연인과의 관계에서 대체로 안정감을 느끼는 경향이 있어요. 혼자만의 시간과 함께하는 시간 사이에서 균형을 잘 잡고, 연인을 크게 의심하거나 지나치게 거리를 두지 않는 편이에요. 갈등이 생겨도 차분하게 대화로 풀어나가려는 태도를 보이는 경우가 많아요.',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  'wavy-sea': {
    name: '파도치는 바다형',
    emoji: '🌪️',
    tagline: '강렬하고 밀착적인 관계 패턴',
    description:
      '연인에 대한 감정이 크고 깊은 만큼, 관계에서 불안을 느끼는 순간도 많은 경향이 있어요. 연인의 반응 하나하나에 민감하게 반응하거나, 관계가 흔들릴까 봐 걱정되는 때가 있을 수 있어요. 이런 패턴은 깊이 사랑하는 사람의 특성이기도 해요. 자신의 감정을 있는 그대로 인식하고 천천히 살펴보는 것이 도움이 될 수 있어요.',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  'lone-island': {
    name: '나만의 섬형',
    emoji: '🏝️',
    tagline: '독립적이고 거리감 있는 관계 패턴',
    description:
      '혼자만의 공간과 독립성을 중요하게 여기는 경향이 있어요. 연인이 너무 가까워지거나 감정적으로 기대려 하면 부담스럽거나 숨막히는 느낌을 받을 수 있어요. 이런 패턴이 나쁜 건 아니에요. 다만, 때로는 내 마음을 조금 더 표현해보는 연습이 관계에 따뜻함을 더할 수 있어요.',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  'stormy-sea': {
    name: '폭풍 속 바다형',
    emoji: '⛈️',
    tagline: '복잡하고 혼란스러운 관계 패턴',
    description:
      '연인과 가까워지고 싶은 마음과 거리를 두고 싶은 마음이 동시에 드는 경향이 있어요. 버려질까 봐 불안한 동시에, 너무 가까워지면 부담스럽거나 두려운 느낌이 공존할 수 있어요. 이런 복잡한 패턴은 혼란스럽게 느껴질 수 있지만, 자신의 감정 패턴을 이해하는 것이 첫걸음이에요. 신뢰할 수 있는 사람과 이야기 나눠보는 것도 도움이 될 수 있어요.',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  'mirror-sea': {
    name: '거울 같은 바다형',
    emoji: '🪞',
    tagline: '상황에 따라 달라지는 유연한 관계 패턴',
    description:
      '어떤 상황에서나 상대방과 관계의 흐름에 따라 자연스럽게 반응하는 유연함이 있어요. 때로는 가까워지고 싶은 마음이 앞서기도 하고, 때로는 혼자만의 공간이 필요하다는 느낌이 들기도 하죠. 이 두 가지가 균형을 이루고 있는 상태예요. 고정된 패턴보다는 현재 관계에서 내가 실제로 어떤 감정을 느끼는지가 더 중요한 정보가 될 수 있어요.',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
}

const CUTOFF = 18

export function calcAttachmentResult(answers: Record<string, number>): AttachmentResult {
  let anxietyScore = 0
  let avoidanceScore = 0

  for (const q of ATTACHMENT_QUESTIONS) {
    const raw = answers[q.id] ?? 0
    const score = q.reverse ? 6 - raw : raw
    if (q.axis === 'anxiety') anxietyScore += score
    else avoidanceScore += score
  }

  if (anxietyScore === CUTOFF && avoidanceScore === CUTOFF) {
    return { anxietyScore, avoidanceScore, type: 'mirror-sea' }
  }

  const highAnxiety = anxietyScore > CUTOFF
  const highAvoidance = avoidanceScore > CUTOFF

  let type: AttachmentType
  if (!highAnxiety && !highAvoidance) type = 'calm-sea'
  else if (highAnxiety && !highAvoidance) type = 'wavy-sea'
  else if (!highAnxiety && highAvoidance) type = 'lone-island'
  else type = 'stormy-sea'

  return { anxietyScore, avoidanceScore, type }
}

export function encodeAttachmentShare(anxietyScore: number, avoidanceScore: number): string {
  return `${anxietyScore}-${avoidanceScore}`
}

export function decodeAttachmentShare(param: string): { anxietyScore: number; avoidanceScore: number } | null {
  const parts = param.split('-')
  if (parts.length !== 2) return null
  const a = parseInt(parts[0], 10)
  const v = parseInt(parts[1], 10)
  if (isNaN(a) || isNaN(v)) return null
  if (a < 6 || a > 30 || v < 6 || v > 30) return null
  return { anxietyScore: a, avoidanceScore: v }
}
