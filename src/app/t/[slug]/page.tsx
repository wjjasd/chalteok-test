import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTest, TESTS, SITE_URL } from '@/content/tests'
import { THEMES } from '@/lib/tests/themes'
import { estimatedMinutes } from '@/lib/tests/scoring'
import StartButton from './StartButton'

export const dynamicParams = false

export function generateStaticParams() {
  return TESTS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const test = getTest(slug)
  if (!test) return {}
  const url = `${SITE_URL}/t/${slug}`
  return {
    title: test.seo.title,
    description: test.seo.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: test.seo.title,
      description: test.seo.description,
      images: [{ url: `${SITE_URL}/api/og/t/${slug}`, width: 1200, height: 630 }],
    },
  }
}

export default async function TestIntroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const test = getTest(slug)
  if (!test) notFound()
  const theme = THEMES[test.theme]

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 ${theme.pageBg}`}>
      <div className="w-full max-w-lg text-center">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${theme.badge}`}>
          {test.questions.length}문항 · 약 {estimatedMinutes(test)}분
        </span>
        <div className="text-6xl mb-4">{test.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-snug">{test.title}</h1>
        <p className={`text-base font-medium mb-6 ${theme.accentText}`}>{test.subtitle}</p>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 whitespace-pre-line">{test.intro}</p>

        <StartButton slug={test.slug} className={theme.primaryBtn} />

        <div className="mt-10">
          <p className="text-xs text-gray-400 mb-3">나올 수 있는 결과</p>
          <div className="flex flex-wrap justify-center gap-2">
            {test.results.map((r) => (
              <span key={r.id} className="text-sm bg-white border border-gray-100 rounded-full px-3 py-1 text-gray-600">
                {r.emoji} {r.name}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          재미로 보는 성찰 테스트이며 전문적 심리 진단이 아닙니다. 응답은 기기 밖으로 전송되지 않습니다.
        </p>
        <Link href="/" className="inline-block mt-3 text-xs text-gray-400 hover:text-gray-600">
          ← 다른 테스트 보기
        </Link>
      </div>
    </main>
  )
}
