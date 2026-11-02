import type { TestDefinition } from '@/lib/tests/types'

const test: TestDefinition = {
  slug: 'quit-timing',
  title: '퇴사 타이밍 테스트',
  subtitle: '퇴사할까 말까, 내 이직 타이밍은 지금일까?',
  intro: '일요일 밤마다 퇴사를 고민하고 있나요?\n10개의 상황에 솔직하게 답하면, 지금 내가 어떤 상태인지와 다음 한 걸음을 알려드려요.',
  emoji: '🌿',
  theme: 'emerald',
  category: 'life',
  scoring: 'type',
  publishedAt: '2026-11-02',
  seo: {
    title: '퇴사 테스트 — 퇴사할까 말까? 내 이직 타이밍 확인 | 찰떡 테스트',
    description:
      "퇴사할까 말까 고민된다면? 10개 질문으로 지금 내 상태가 '지금 당장 출발'인지 '충전이 먼저'인지 알려드려요. 1분이면 끝나는 무료 퇴사 타이밍 테스트.",
  },
  shareTitle: '내 퇴사 타이밍: {name} {emoji}',
  questions: [
    {
      id: 'q1',
      text: '일요일 밤 9시, 내일 출근을 생각하면?',
      options: [
        { label: '그냥 평범한 일요일 밤이다', weights: { stay: 2 } },
        { label: '한숨은 나오지만 막상 가면 또 한다', weights: { harvest: 2, stay: 1 } },
        { label: '배가 아프고 숨이 턱 막힌다', weights: { burnout: 2 } },
        { label: '나도 모르게 이력서 파일을 열어 본다', weights: { 'go-now': 2, prepare: 1 } },
      ],
    },
    {
      id: 'q2',
      text: '지금 내 이력서 상태는?',
      options: [
        { label: '최근에 업데이트했다. 바로 낼 수 있다', weights: { 'go-now': 2 } },
        { label: '쓰다 만 채로 폴더에 있다', weights: { prepare: 2 } },
        { label: '입사하고 한 번도 안 열어 봤다', weights: { stay: 1, harvest: 1 } },
        { label: '열어 봐도 뭘 써야 할지 모르겠다', weights: { wanderer: 2 } },
      ],
    },
    {
      id: 'q3',
      text: '요즘 회사에서 배우는 것은?',
      options: [
        { label: '아직 배울 게 꽤 많다', weights: { harvest: 2, stay: 1 } },
        { label: '매일 같은 일의 반복이다', weights: { 'go-now': 1, prepare: 1 } },
        { label: '배울 힘조차 남아 있지 않다', weights: { burnout: 2 } },
        { label: '이 일 자체가 나랑 맞는지 모르겠다', weights: { wanderer: 2 } },
      ],
    },
    {
      id: 'q4',
      text: '지금 당장 퇴사하면, 통장으로 버틸 수 있는 기간은?',
      options: [
        { label: '6개월 이상은 거뜬하다', weights: { 'go-now': 2 } },
        { label: '2~3개월 정도', weights: { prepare: 2 } },
        { label: '월급날만 기다리며 산다', weights: { harvest: 1, stay: 1 } },
        { label: '돈보다 지금 내 상태가 더 문제다', weights: { burnout: 2 } },
      ],
    },
    {
      id: 'q5',
      text: '친구가 "너네 회사 요즘 어때?" 하고 묻는다',
      options: [
        { label: '"나쁘지 않아, 다닐 만해"', weights: { stay: 2 } },
        { label: '30분 동안 쉬지 않고 하소연한다', weights: { burnout: 1, prepare: 1 } },
        { label: '장단점을 냉정하게 정리해 준다', weights: { harvest: 2 } },
        { label: '"회사보다 내가 뭘 원하는지 모르겠어"', weights: { wanderer: 2 } },
      ],
    },
    {
      id: 'q6',
      text: '헤드헌터에게 연락이 왔다',
      options: [
        { label: '바로 통화해서 조건부터 물어본다', weights: { 'go-now': 2 } },
        { label: '저장해 두고, 준비되면 연락하기로 한다', weights: { prepare: 2 } },
        { label: '별로 관심이 안 간다', weights: { stay: 2 } },
        { label: '그게 내가 원하는 일인지부터 고민된다', weights: { wanderer: 2 } },
      ],
    },
    {
      id: 'q7',
      text: '모처럼 연차를 쓴 날, 나는?',
      options: [
        { label: '이때다 싶어 면접 일정을 넣는다', weights: { 'go-now': 2 } },
        { label: '하루 종일 누워 있어도 피곤하다', weights: { burnout: 2 } },
        { label: '자격증이나 공부를 조금 해 둔다', weights: { harvest: 1, prepare: 1 } },
        { label: '전혀 다른 분야의 원데이 클래스를 들어 본다', weights: { wanderer: 2 } },
      ],
    },
    {
      id: 'q8',
      text: '지금 퇴사한다면 가장 걱정되는 것은?',
      options: [
        { label: '딱히 없다. 갈 곳이 있다', weights: { 'go-now': 2 } },
        { label: '경력 공백과 채용 공고', weights: { prepare: 2 } },
        { label: '여기만 한 곳이 또 있을까', weights: { stay: 2 } },
        { label: '그다음에 뭘 해야 할지', weights: { wanderer: 2 } },
      ],
    },
    {
      id: 'q9',
      text: '요즘 내 몸 상태는?',
      options: [
        { label: '쌩쌩하다', weights: { harvest: 2 } },
        { label: '그럭저럭 괜찮다', weights: { stay: 1, prepare: 1 } },
        { label: '잠을 설치고 머리가 자주 아프다', weights: { burnout: 2 } },
        { label: '몸은 괜찮은데 의욕이 없다', weights: { wanderer: 1, burnout: 1 } },
      ],
    },
    {
      id: 'q10',
      text: '1년 뒤, 내가 바라는 모습은?',
      options: [
        { label: '새 회사 명함을 들고 있는 나', weights: { 'go-now': 1, prepare: 1 } },
        { label: '지금 회사에서 연봉 협상에 성공한 나', weights: { harvest: 2, stay: 1 } },
        { label: '푹 쉬고 완전히 회복한 나', weights: { burnout: 2 } },
        { label: '완전히 다른 일을 하고 있는 나', weights: { wanderer: 2 } },
      ],
    },
  ],
  results: [
    {
      id: 'go-now',
      name: '지금 당장 출발형',
      emoji: '🚀',
      tagline: '마음도 준비도 끝, 이제 버튼만 누르면 되는 상태',
      description:
        '마음은 이미 떠났고, 이력서와 통장 같은 현실적인 준비까지 꽤 갖춰져 있어요. 고민을 오래 끌수록 오히려 지금의 에너지가 식을 수 있는 타이밍이에요. 다만 감정이 아니라 조건으로 결정하고 있는지만 마지막으로 점검해 보세요.',
      traits: [
        '헤드헌터 연락에 바로 답장하는 편이에요',
        '회사 이야기를 하면 이미 과거형으로 말할 때가 있어요',
        '연차는 쉬는 날이 아니라 면접 보는 날이에요',
        '"언제 나가지?"보다 "어디로 가지?"를 더 고민해요',
      ],
      advice: '최종 합격 통보를 받기 전까지는 사직서를 내지 마세요. 순서만 지키면 완벽한 출발이에요.',
    },
    {
      id: 'prepare',
      name: '짐 싸는 중형',
      emoji: '🧳',
      tagline: '가방은 쌌는데 아직 신발을 못 신은 상태',
      description:
        '떠나고 싶은 마음은 분명한데, 이력서나 모아 둔 돈처럼 버팀목이 조금 부족한 상태예요. 지금 필요한 건 결단보다 준비 기간이에요. 3개월쯤 계획을 세워 두면 퇴사가 도망이 아니라 이동이 될 거예요.',
      traits: [
        '쓰다 만 이력서가 폴더 어딘가에 있어요',
        '채용 공고는 자주 보는데 지원 버튼은 아직이에요',
        '"조금만 더 모으고 나가자"를 몇 번째 말하고 있어요',
        '경력 공백이 생길까 봐 은근히 걱정돼요',
      ],
      advice: '이번 주에 이력서 한 줄만 고쳐 보세요. 준비는 작게 시작할수록 빨리 끝나요.',
    },
    {
      id: 'harvest',
      name: '본전 회수형',
      emoji: '💰',
      tagline: '떠나기 전에 챙겨갈 게 아직 남은 상태',
      description:
        '불만이 없는 건 아니지만, 아직 이 회사에서 얻어 갈 경험과 경력이 남아 있어요. 지금 나가면 아쉬움이 남을 수 있어요. 언제, 무엇을 챙겨서 나갈지 목표를 정해 두면 남아 있는 시간도 훨씬 덜 답답해요.',
      traits: [
        '회사의 장단점을 감정보다 숫자로 따져 봐요',
        '불만은 있어도 출근은 성실하게 해요',
        '"이 프로젝트만 끝내고"가 입버릇이에요',
        '자격증이나 공부로 다음을 조용히 준비해요',
      ],
      advice: "'이것까지 얻고 나간다' 목록을 세 줄만 적어 보세요. 그게 곧 나의 퇴사 날짜가 돼요.",
    },
    {
      id: 'stay',
      name: '사실 여기가 맞는형',
      emoji: '🏡',
      tagline: '투덜대지만 사실 꽤 괜찮은 자리에 있는 상태',
      description:
        '가끔 퇴사를 떠올리지만, 막상 따져 보면 지금 자리가 나쁘지 않아요. 사람이나 환경처럼 놓치기 아까운 것들이 있는 상태예요. 지금은 떠날 이유를 찾기보다 지금 자리를 더 편하게 만드는 쪽이 훨씬 효율적일 수 있어요.',
      traits: [
        '퇴사 얘기는 농담 반 진담 반이에요',
        '헤드헌터 연락이 와도 크게 흔들리지 않아요',
        '"여기만 한 데 없지" 하는 순간이 종종 있어요',
        '불만이 생겨도 대화로 풀어 보려는 편이에요',
      ],
      advice: '연봉 협상이나 업무 조정처럼 지금 자리에서 바꿀 수 있는 것부터 요청해 보세요.',
    },
    {
      id: 'burnout',
      name: '배터리 1%형',
      emoji: '🪫',
      tagline: '이직보다 충전이 먼저 필요한 상태',
      description:
        '회사가 문제인지 내가 지친 건지 헷갈릴 만큼 에너지가 바닥난 상태예요. 이럴 때 내린 큰 결정은 나중에 후회로 남기 쉬워요. 이직 준비보다 먼저 잠과 쉼을 되찾는 게 가장 빠른 길이에요.',
      traits: [
        '쉬는 날에도 몸이 무겁고 피곤해요',
        '일요일 저녁이 유난히 길고 괴로워요',
        '좋아하던 것들도 요즘은 시큰둥해요',
        '"그냥 다 그만두고 싶다"는 생각이 자주 들어요',
      ],
      advice: '긴 휴가나 휴직처럼 쉬는 방법을 먼저 알아보세요. 힘들 땐 주변이나 전문가에게 기대도 괜찮아요.',
    },
    {
      id: 'wanderer',
      name: '방향 탐색형',
      emoji: '🧭',
      tagline: "퇴사보다 '뭘 하고 싶은지'가 먼저인 상태",
      description:
        '지금 회사가 싫다기보다, 이 일이 나와 맞는지 자체가 궁금한 상태예요. 이대로 이직하면 같은 고민을 또 하게 될 수 있어요. 회사를 바꾸기 전에 내가 좋아하는 일을 작게 실험해 보는 시간이 필요해요.',
      traits: [
        '이력서를 열면 무엇을 써야 할지 막막해요',
        '전혀 다른 분야 이야기에 귀가 솔깃해요',
        '"나는 뭘 좋아하지?"를 자주 생각해요',
        '연봉보다 의미를 더 따지는 편이에요',
      ],
      advice: '퇴근 후 한 달만 관심 있는 분야를 작게 체험해 보세요. 방향은 해 볼 때 보여요.',
    },
  ],
}

export default test
