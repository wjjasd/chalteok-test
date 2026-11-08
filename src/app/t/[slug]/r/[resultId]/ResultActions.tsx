'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { mineKey } from '@/lib/tests/mine'
import { SITE_URL } from '@/content/tests'
import ShareActions from '@/components/ShareActions'

interface ShareProps {
  slug: string
  resultId: string
  shareTitle: string
  shareDescription: string
  softBtn: string
}

export default function ResultShare({ slug, resultId, shareTitle, shareDescription, softBtn }: ShareProps) {
  const shareUrl = `${SITE_URL}/t/${slug}/r/${resultId}`
  const ogUrl = `/og/t/${slug}/${resultId}.png`

  const saveImage = async () => {
    const res = await fetch(ogUrl)
    if (!res.ok) throw new Error(`og ${res.status}`)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `찰떡_${slug}_${resultId}.png`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  return (
    <ShareActions
      testSlug={slug}
      resultId={resultId}
      kakao={{ title: shareTitle, description: shareDescription, imageUrl: `${SITE_URL}${ogUrl}`, url: shareUrl }}
      linkUrl={shareUrl}
      onSaveImage={saveImage}
      softBtnClass={softBtn}
    />
  )
}

export function RetakeButton({ slug, resultId, primaryBtn }: { slug: string; resultId: string; primaryBtn: string }) {
  const [mine, setMine] = useState(false)

  useEffect(() => {
    try {
      // 공유 링크로 들어온 사람과 직접 푼 사람의 CTA를 구분 (sessionStorage는 클라이언트에서만 읽을 수 있음)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMine(sessionStorage.getItem(mineKey(slug)) === resultId)
    } catch {}
  }, [slug, resultId])

  return (
    <Link
      href={`/t/${slug}`}
      onClick={() => track(mine ? 'retake' : 'try_from_share', { test_slug: slug, result_id: resultId })}
      className={`block text-center w-full py-4 rounded-2xl font-bold ${primaryBtn}`}
    >
      {mine ? '다시 하기' : '나도 테스트하기 →'}
    </Link>
  )
}
