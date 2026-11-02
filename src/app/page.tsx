import type { Metadata } from 'next'
import Link from 'next/link'
import { getCatalog, activeCategories, itemListJsonLd } from '@/content/catalog'
import { SITE_OG } from '@/lib/site'
import { TestGrid, CategoryTabs, SiteFooter } from '@/components/TestGrid'

export const metadata: Metadata = {
  alternates: { canonical: 'https://chalteok.com' },
  openGraph: { ...SITE_OG, url: 'https://chalteok.com' },
}

export default function HomePage() {
  const items = getCatalog()
  const categories = activeCategories()

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(items, '찰떡 테스트 심리테스트 목록')) }}
      />
      <div className="mx-auto max-w-2xl px-4 pb-12 pt-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
            🍡 찰떡 테스트
          </Link>
          <span className="text-xs text-gray-400">테스트 {items.length}개</span>
        </header>

        <section className="pb-8 pt-10 text-center">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            1분이면 끝나는
            <br />
            <span className="text-rose-500">무료 심리테스트</span> 모음
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            연애부터 직장 생활까지, 오늘은 어떤 나를 만나볼까요?
            <br />
            회원가입 없이 바로 하고, 결과는 카톡으로 공유하세요.
          </p>
        </section>

        <CategoryTabs categories={categories} />

        <section className="mt-5" aria-label="전체 테스트">
          <TestGrid items={items} />
        </section>

        <SiteFooter />
      </div>
    </main>
  )
}
