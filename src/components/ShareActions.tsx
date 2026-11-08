'use client'

import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { shareToKakao, type KakaoShareContent } from '@/lib/kakaoShare'
import { track } from '@/lib/analytics'

interface ShareActionsProps {
  /** GA test_slug */
  testSlug: string
  /** GA result_id */
  resultId: string
  kakao: KakaoShareContent
  /** 링크 복사 버튼(및 카카오 실패 시 대체)이 복사할 URL */
  linkUrl: string
  /** 이미지 생성·다운로드. 실패하면 throw — 안내 문구는 컴포넌트가 띄운다 */
  onSaveImage: () => void | Promise<void>
  /** 테마별 보조 버튼 클래스 (THEMES[*].softBtn) */
  softBtnClass: string
}

const Spinner = () => (
  <span aria-hidden className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

export default function ShareActions({ testSlug, resultId, kakao, linkUrl, onSaveImage, softBtnClass }: ShareActionsProps) {
  const [kakaoBusy, setKakaoBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const timers = useRef<{ notice?: ReturnType<typeof setTimeout>; copied?: ReturnType<typeof setTimeout> }>({})
  const params = { test_slug: testSlug, result_id: resultId }

  const flash = (msg: string) => {
    clearTimeout(timers.current.notice)
    setNotice(msg)
    timers.current.notice = setTimeout(() => setNotice(''), 3000)
  }

  const copy = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(linkUrl)
      clearTimeout(timers.current.copied)
      setCopied(true)
      timers.current.copied = setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      return false
    }
  }

  const copyLink = async () => {
    track('share_link', params)
    if (await copy()) flash('링크를 복사했어요!')
    else flash(linkUrl)
  }

  const shareKakao = async () => {
    if (kakaoBusy) return
    track('share_kakao', params)
    flushSync(() => setKakaoBusy(true))
    const ok = await shareToKakao(kakao)
    setKakaoBusy(false)
    if (ok) return
    track('share_link', { ...params, via: 'kakao_fallback' })
    if (await copy()) flash('카카오톡을 열 수 없어 링크를 복사했어요. 원하는 곳에 붙여넣어 주세요')
    else flash(`카카오톡을 열 수 없어요. 이 링크를 복사해 공유해 주세요: ${linkUrl}`)
  }

  const saveImage = async () => {
    if (saving) return
    track('save_image', params)
    flushSync(() => setSaving(true))
    // 스피너가 그려진 뒤 무거운 canvas 작업을 시작
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)))
    try {
      await onSaveImage()
    } catch {
      flash('이미지를 저장하지 못했어요. 화면을 캡처해 공유해 주세요')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-label="결과 공유" className="space-y-3">
      <button
        type="button"
        onClick={shareKakao}
        disabled={kakaoBusy}
        aria-busy={kakaoBusy}
        className="w-full min-h-14 py-4 rounded-2xl font-bold text-base shadow-sm transition-opacity active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
      >
        {kakaoBusy ? (
          <>
            <Spinner />
            <span className="sr-only">카카오톡 공유 준비 중</span>
          </>
        ) : (
          '💬 카카오톡으로 공유하기'
        )}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={copyLink}
          className={`min-h-11 py-3 rounded-2xl font-semibold border text-sm transition-colors ${softBtnClass}`}
        >
          {copied ? '✓ 복사됨' : '🔗 링크 복사'}
        </button>
        <button
          type="button"
          onClick={saveImage}
          disabled={saving}
          aria-busy={saving}
          className={`min-h-11 py-3 rounded-2xl font-semibold border text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${softBtnClass}`}
        >
          {saving ? (
            <>
              <Spinner />
              저장 중...
            </>
          ) : (
            '📷 이미지 저장'
          )}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-4 text-center text-xs text-gray-500 break-all">
        {notice}
      </p>
    </section>
  )
}
