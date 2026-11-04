import type { SectionId } from '@/lib/questions'

// 정적 export: 섹션 페이지(클라이언트 컴포넌트)는 generateStaticParams를 둘 수 없어 layout에서 a~h를 전수 생성
export const dynamicParams = false

const SECTION_IDS: SectionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export function generateStaticParams() {
  return SECTION_IDS.map((id) => ({ id: id.toLowerCase() }))
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children
}
