import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { getTest, TESTS, SITE_URL } from '@/content/tests'
import { THEMES } from '@/lib/tests/themes'
import { SITE_OG } from '@/lib/site'
import { getCatalog } from '@/content/catalog'
import ResultShare, { RetakeButton } from './ResultActions'
import TestHeader from '@/components/TestHeader'

export const dynamicParams = false

export function generateStaticParams() {
  return TESTS.flatMap((t) => t.results.map((r) => ({ slug: t.slug, resultId: r.id })))
}

type Params = Promise<{ slug: string; resultId: string }>

async function load(params: Params) {
  const { slug, resultId } = await params
  const test = getTest(slug)
  const result = test?.results.find((r) => r.id === resultId)
  return test && result ? { test, result } : null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await load(params)
  if (!data) return {}
  const { test, result } = data
  const title = `${result.emoji} ${result.name} — ${test.title} | 찰떡 테스트`
  // 네이버 권장 80자 이내 (validate-tests가 길이 검사)
  const resultDescription = `${test.title} 결과 '${result.name}' — ${result.tagline}. 나도 1분 만에 해보기`
  return {
    title,
    description: resultDescription,
    alternates: { canonical: `${SITE_URL}/t/${test.slug}` },
    openGraph: {
      ...SITE_OG,
      url: `${SITE_URL}/t/${test.slug}/r/${result.id}`,
      title,
      description: resultDescription,
      images: [{ url: `${SITE_URL}/og/t/${test.slug}/${result.id}.png`, width: 1200, height: 630 }],
    },
  }
}

export default async function ResultPage({ params }: { params: Params }) {
  const data = await load(params)
  if (!data) notFound()
  const { test, result } = data
  const theme = THEMES[test.theme]
  const byId = (id?: string) => test.results.find((r) => r.id === id)
  const best = byId(result.bestMatch)
  const worst = byId(result.worstMatch)
  const others = getCatalog()
    .filter((i) => i.href !== `/t/${test.slug}`)
    .slice(0, 6)

  return (
    <main className={`min-h-screen pb-16 ${theme.pageBg}`}>
      <TestHeader title={test.title} />
      <div className="max-w-lg mx-auto px-4 pt-20 space-y-5">
        <div className="text-center">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${theme.badge}`}>
            {test.title} 결과
          </span>
        </div>

        <section className={`rounded-2xl border p-6 ${theme.card}`}>
          <div className="text-center mb-4">
            <div className="text-6xl mb-3">{result.emoji}</div>
            <h1 className={`text-2xl font-bold mb-1 ${theme.accentText}`}>{result.name}</h1>
            <p className="text-sm text-gray-500">{result.tagline}</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.description}</p>
        </section>

        <ResultShare
          slug={test.slug}
          resultId={result.id}
          shareTitle={test.shareTitle.replace('{name}', result.name).replace('{emoji}', result.emoji)}
          shareDescription={`${result.tagline} — 찰떡 ${test.title}`}
          softBtn={theme.softBtn}
        />

        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">이런 특징이 있어요</h2>
          <ul className="space-y-2">
            {result.traits.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                <span className={theme.accentText}>✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 bg-gray-50 rounded-xl p-3 text-sm text-gray-600">💡 {result.advice}</div>
        </section>

        {(best || worst) && (
          <section className="grid grid-cols-2 gap-3">
            {best && (
              <Link href={`/t/${test.slug}/r/${best.id}`} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm">
                <p className="text-xs text-gray-400 mb-1">잘 맞는 유형</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {best.emoji} {best.name}
                </p>
              </Link>
            )}
            {worst && (
              <Link href={`/t/${test.slug}/r/${worst.id}`} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm">
                <p className="text-xs text-gray-400 mb-1">부딪히기 쉬운 유형</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {worst.emoji} {worst.name}
                </p>
              </Link>
            )}
          </section>
        )}

        <RetakeButton slug={test.slug} resultId={result.id} primaryBtn={theme.primaryBtn} />

        {/* 카카오 애드핏 */}
        <div className="flex items-center justify-center" style={{ minHeight: 100 }}>
          <ins
            className="kakao_ad_area"
            style={{ display: 'none' }}
            data-ad-unit="DAN-3v7FG7ynKycb5hKF"
            data-ad-width="320"
            data-ad-height="100"
          />
        </div>
        <Script src="//t1.kakaocdn.net/kas/static/ba.min.js" strategy="afterInteractive" async />

        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">다른 테스트도 해보세요</h2>
          <div className="grid gap-2">
            {others.map((t) => (
              <Link key={t.href} href={t.href} className="flex items-center gap-3 rounded-xl p-3 bg-gray-50 hover:bg-gray-100">
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{t.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-gray-300">
          <Link href="/privacy" className="hover:text-gray-400">개인정보처리방침</Link>
        </p>
      </div>
    </main>
  )
}
