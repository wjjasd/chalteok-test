import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTest, TESTS, SITE_URL } from '@/content/tests'
import { CATEGORIES } from '@/content/catalog'
import { THEMES } from '@/lib/tests/themes'
import { estimatedMinutes } from '@/lib/tests/scoring'
import { SITE_OG } from '@/lib/site'
import StartButton from './StartButton'
import TestHeader from '@/components/TestHeader'

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
    keywords: test.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      ...SITE_OG,
      url,
      title: test.seo.title,
      description: test.seo.description,
      images: [{ url: `${SITE_URL}/og/t/${slug}/cover.png`, width: 1200, height: 630 }],
    },
  }
}

export default async function TestIntroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const test = getTest(slug)
  if (!test) notFound()
  const theme = THEMES[test.theme]
  const category = CATEGORIES[test.category]
  const url = `${SITE_URL}/t/${slug}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '찰떡 테스트', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `${category.heading}`, item: `${SITE_URL}/c/${test.category}` },
        { '@type': 'ListItem', position: 3, name: test.seo.h1 ?? test.title, item: url },
      ],
    },
    ...(test.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: test.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : []),
  ]

  return (
    <main className={`min-h-screen px-4 pt-20 pb-12 ${theme.pageBg}`}>
      <TestHeader title={test.title} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto w-full max-w-lg">
        <nav aria-label="경로" className="mb-8 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            찰떡 테스트
          </Link>
          <span className="mx-1.5">›</span>
          <Link href={`/c/${test.category}`} className="hover:text-gray-600">
            {category.label}
          </Link>
        </nav>

        <section className="text-center">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${theme.badge}`}>
            {test.questions.length}문항 · 약 {estimatedMinutes(test)}분 · 무료
          </span>
          <div className="text-6xl mb-4">{test.emoji}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-snug">{test.seo.h1 ?? test.title}</h1>
          <p className={`text-base font-medium mb-6 ${theme.accentText}`}>{test.subtitle}</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-8 whitespace-pre-line">{test.intro}</p>

          <StartButton slug={test.slug} className={theme.primaryBtn} />
          <p className="mt-3 text-xs text-gray-400">회원가입 없이 바로 시작 · 응답은 기기 밖으로 전송되지 않아요</p>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            {test.title} 결과 유형 {test.results.length}가지
          </h2>
          <ul className="grid gap-2">
            {test.results.map((r) => (
              <li key={r.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                <span className="text-2xl leading-none">{r.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{r.name}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{r.tagline}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {test.guide?.map((g) => (
          <section key={g.heading} className="mt-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{g.heading}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              {g.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        {test.faq && test.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">자주 묻는 질문</h2>
            <dl className="space-y-3">
              {test.faq.map((f) => (
                <div key={f.q} className="rounded-2xl border border-gray-100 bg-white p-4">
                  <dt className="text-sm font-semibold text-gray-800">Q. {f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-10">
          <StartButton slug={test.slug} className={theme.primaryBtn} />
        </div>

        <p className="mt-8 text-center">
          <Link href={`/c/${test.category}`} className="text-xs text-gray-400 hover:text-gray-600">
            ← {category.heading} 더 보기
          </Link>
        </p>
      </div>
    </main>
  )
}
