export interface AttachmentQuestion {
  id: string
  axis: 'anxiety' | 'avoidance'
  reverse: boolean
  text: string
}

export const ATTACHMENT_QUESTIONS: AttachmentQuestion[] = [
  { id: 'A1', axis: 'anxiety', reverse: false, text: '나는 연인에게 연락이 늦게 오면 관계가 틀어진 건 아닐지 불안해진다.' },
  { id: 'A2', axis: 'anxiety', reverse: false, text: '나는 연인이 나를 얼마나 좋아하는지 자꾸 확인하고 싶어진다.' },
  { id: 'A3', axis: 'anxiety', reverse: false, text: '나는 연인이 나 말고 다른 사람에게 관심을 보이면 극도로 신경 쓰인다.' },
  { id: 'A4', axis: 'anxiety', reverse: false, text: '나는 연인이 나를 떠날 것 같은 느낌이 들면 무슨 수를 써서라도 붙잡고 싶어진다.' },
  { id: 'A5', axis: 'anxiety', reverse: true,  text: '나는 연인이 연락을 잘 안 해도 각자의 시간이 있다고 편하게 받아들인다.' },
  { id: 'A6', axis: 'anxiety', reverse: true,  text: '나는 연인이 나를 좋아한다는 사실을 크게 의심하지 않는 편이다.' },
  { id: 'V1', axis: 'avoidance', reverse: false, text: '나는 연인이 나에게 너무 기대려 하면 부담스러워진다.' },
  { id: 'V2', axis: 'avoidance', reverse: false, text: '나는 연인과 갈등이 생기면 혼자 시간을 갖고 정리하는 게 더 편하다.' },
  { id: 'V3', axis: 'avoidance', reverse: false, text: '나는 연애 관계에서 내 속마음을 꺼내 보이는 것이 어색하다.' },
  { id: 'V4', axis: 'avoidance', reverse: false, text: '나는 연인이 나를 필요로 한다는 표현을 과하게 하면 거리를 두고 싶어진다.' },
  { id: 'V5', axis: 'avoidance', reverse: true,  text: '나는 연인에게 힘든 일을 먼저 털어놓을 수 있다.' },
  { id: 'V6', axis: 'avoidance', reverse: true,  text: '나는 연인이 나를 감정적으로 의지할 때 기꺼이 곁에 있어 주고 싶다.' },
]
