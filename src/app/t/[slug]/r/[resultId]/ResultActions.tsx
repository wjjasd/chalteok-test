'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadKakaoSdk, initKakao } from '@/lib/kakaoSdk'
import { track } from '@/lib/analytics'
import { mineKey } from '@/lib/tests/mine'
import { SITE_URL } from '@/content/tests'

interface Props {
  slug: string
  resultId: string
  shareTitle: string
  shareDescription: string
  primaryBtn: string
  softBtn: string
}

export default function ResultActions({ slug, resultId, shareTitle, shareDescription, primaryBtn, softBtn }: Props) {
  const [mine, setMine] = useState(false)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const shareUrl = `${SITE_URL}/t/${slug}/r/${resultId}`
  const ogUrl = `/og/t/${slug}/${resultId}.png`
  const params = { test_slug: slug, result_id: resultId }

  useEffect(() => {
    try {
      // 공유 링크로 들어온 사람과 직접 푼 사람의 CTA를 구분 (sessionStorage는 클라이언트에서만 읽을 수 있음)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMine(sessionStorage.getItem(mineKey(slug)) === resultId)
    } catch {}
    loadKakaoSdk().then(initKakao).catch(() => {})
  }, [slug, resultId])

  const flash = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 2500)
  }

  const copyLink = async () => {
    track('share_link', params)
    try {
      await navigator.clipboard.writeText(shareUrl)
      flash('링크를 복사했어요!')
    } catch {
      flash(shareUrl)
    }
  }

  const shareKakao = async () => {
    track('share_kakao', params)
    try {
      await loadKakaoSdk()
      initKakao()
    } catch {}
    if (!window.Kakao?.Share) {
      await copyLink()
      flash('카카오톡을 열 수 없어 링크를 복사했어요')
      return
    }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: shareTitle,
        description: shareDescription,
        imageUrl: `${SITE_URL}${ogUrl}`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
    })
  }

  const saveImage = async () => {
    track('save_image', params)
    setBusy(true)
    try {
      const blob = await (await fetch(ogUrl)).blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `찰떡_${slug}_${resultId}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch {
      flash('이미지를 저장하지 못했어요')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={shareKakao}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm"
        style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
      >
        💬 카카오톡으로 공유하기
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={copyLink} className={`py-3.5 rounded-2xl font-semibold border text-sm ${softBtn}`}>
          🔗 링크 복사
        </button>
        <button
          type="button"
          onClick={saveImage}
          disabled={busy}
          className={`py-3.5 rounded-2xl font-semibold border text-sm disabled:opacity-50 ${softBtn}`}
        >
          {busy ? '저장 중...' : '📷 이미지 저장'}
        </button>
      </div>
      <Link
        href={`/t/${slug}`}
        onClick={() => track(mine ? 'retake' : 'try_from_share', params)}
        className={`block text-center w-full py-4 rounded-2xl font-bold ${primaryBtn}`}
      >
        {mine ? '다시 하기' : '나도 테스트하기 →'}
      </Link>
      {notice && <p className="text-center text-xs text-gray-500 break-all">{notice}</p>}
    </section>
  )
}
