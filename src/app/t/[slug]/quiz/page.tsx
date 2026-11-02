import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTest, TESTS } from '@/content/tests'
import QuizClient from './QuizClient'

export const dynamicParams = false

export function generateStaticParams() {
  return TESTS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const test = getTest(slug)
  return test ? { title: `${test.title} 진행 중 | 찰떡 테스트`, robots: { index: false } } : {}
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const test = getTest(slug)
  if (!test) notFound()
  return <QuizClient test={test} />
}
