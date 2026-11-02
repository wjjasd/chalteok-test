'use client'

import Link from 'next/link'
import { track } from '@/lib/analytics'

export default function StartButton({ slug, className }: { slug: string; className: string }) {
  return (
    <Link
      href={`/t/${slug}/quiz`}
      onClick={() => track('test_start', { test_slug: slug })}
      className={`block w-full py-4 rounded-2xl font-bold text-lg shadow-sm transition-colors ${className}`}
    >
      테스트 시작하기
    </Link>
  )
}
