import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORIES, activeCategories, getCatalog, itemListJsonLd } from '@/content/catalog'
import { SITE_URL } from '@/content/tests'
import { SITE_OG } from '@/lib/site'
import { TestGrid, CategoryTabs, SiteFooter } from '@/components/TestGrid'
import type { TestCategory } from '@/lib/tests/types'

export const dynamicParams = false

export function generateStaticParams() {
  return activeCategories().map((category) => ({ category }))
}

type Params = Promise<{ category: string }>

function resolve(category: string): TestCategory | null {
  return activeCategories().includes(category as TestCategory) ? (category as TestCategory) : null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = resolve((await params).category)
  if (!c) return {}
  const meta = CATEGORIES[c]
  const url = `${SITE_URL}/c/${c}`
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      ...SITE_OG,
      url,
      title: meta.title,
      description: meta.description,
      images: [{ url: `${SITE_URL}/og/site.png`, width: 1200, height: 630 }],
    },
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const c = resolve((await params).category)
  if (!c) notFound()
  const meta = CATEGORIES[c]
  const items = getCatalog().filter((i) => i.category === c)

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(items, meta.heading)) }}
      />
      <div className="mx-auto max-w-2xl px-4 pb-12 pt-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
            🍡 찰떡 테스트
          </Link>
          <span className="text-xs text-gray-400">테스트 {items.length}개</span>
        </header>

        <section className="pb-8 pt-10 text-center">
          <div className="text-4xl">{meta.emoji}</div>
          <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">{meta.heading} 모음</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">{meta.description}</p>
        </section>

        <CategoryTabs categories={activeCategories()} current={c} />

        <section className="mt-5" aria-label={`${meta.heading} 목록`}>
          <TestGrid items={items} />
        </section>

        <SiteFooter />
      </div>
    </main>
  )
}
