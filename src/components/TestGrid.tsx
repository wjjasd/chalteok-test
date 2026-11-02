import Link from 'next/link'
import type { CatalogItem } from '@/content/catalog'
import { CATEGORIES } from '@/content/catalog'
import { THEMES } from '@/lib/tests/themes'
import type { TestCategory } from '@/lib/tests/types'

export function TestGrid({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4">
      {items.map((item) => {
        const theme = THEMES[item.theme]
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`relative flex aspect-[4/3] sm:aspect-[16/9] items-center justify-center border-b ${theme.card}`}>
                <span className="text-5xl transition-transform duration-200 group-hover:scale-110 sm:text-6xl">{item.emoji}</span>
                {item.badge && (
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      item.badge === '인기' ? 'bg-rose-500 text-white' : theme.badge
                    }`}
                  >
                    {item.badge === '인기' ? '🔥 인기' : '✨ 신규'}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <h3 className="text-sm font-bold leading-snug text-gray-900 sm:text-base">{item.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">{item.subtitle}</p>
                <p className="mt-2 text-[11px] text-gray-400">
                  {CATEGORIES[item.category].label} · {item.questions}문항 · {item.minutes}분
                </p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function CategoryTabs({ categories, current }: { categories: TestCategory[]; current?: TestCategory }) {
  const base = 'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors'
  const on = 'border-gray-900 bg-gray-900 text-white'
  const off = 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
  return (
    <nav aria-label="테스트 카테고리" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <Link href="/" className={`${base} ${current ? off : on}`}>
        전체
      </Link>
      {categories.map((c) => (
        <Link key={c} href={`/c/${c}`} className={`${base} ${current === c ? on : off}`}>
          {CATEGORIES[c].emoji} {CATEGORIES[c].label}
        </Link>
      ))}
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-100 pt-8 text-center">
      <p className="text-xs leading-relaxed text-gray-400">
        찰떡 테스트는 회원가입 없이 바로 하는 무료 심리테스트 모음이에요.
        <br />
        응답은 기기 밖으로 전송되지 않아요.
      </p>
      <p className="mt-3 text-xs text-gray-300">
        <Link href="/privacy" className="hover:text-gray-500">
          개인정보처리방침
        </Link>
        <span className="mx-2">·</span>© 찰떡 테스트
      </p>
    </footer>
  )
}
