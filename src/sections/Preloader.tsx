import { useRef, useState } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { gsap } from '../lib/gsap'
import { markIntroDone, prefersReducedMotion, useIsoLayoutEffect } from '../lib/motion'
import { lockScroll } from '../lib/smooth'

const SEEN_KEY = 'cb-intro-seen'
// Read once per page load (StrictMode runs effects twice in dev).
const SEEN_BEFORE = (() => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
})()

/** A cup fills with coffee while a counter runs to 100. Never longer than ~1.4 s; shorter on repeat visits. */
export function Preloader() {
  const { t } = useLang()
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useIsoLayoutEffect(() => {
    const el = root.current!
    const reduced = prefersReducedMotion()
    const seen = SEEN_BEFORE
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0)
    lockScroll(true)
    const counter = el.querySelector<HTMLElement>('[data-count]')!
    const fill = el.querySelector('[data-fill]')
    const finish = () => {
      lockScroll(false)
      setGone(true)
    }

    // The static first frame in index.html has been on screen while JS loaded, so the
    // animated part only uses what is left of a ~1.45 s budget (slow phones skip to the fade).
    const elapsed = performance.now() / 1000
    const fillDur = Math.min(0.95, Math.max(0.4, 1.45 - elapsed))
    const quick = reduced || seen || elapsed > 1.6

    const ctx = gsap.context(() => {
      gsap.set(fill, { yPercent: 100 })
      if (quick) {
        counter.textContent = '100'
        gsap.set(fill, { yPercent: 0 })
        gsap.to(el, { opacity: 0, duration: 0.45, delay: reduced || seen ? 0.15 : 0.05, ease: 'power1.out', onStart: markIntroDone, onComplete: finish })
        return
      }
      const state = { v: 0 }
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      tl.to(fill, { yPercent: 0, duration: fillDur }, 0)
        .to(state, { v: 100, duration: fillDur, onUpdate: () => (counter.textContent = String(Math.round(state.v))) }, 0)
        .to('[data-cup]', { scale: 0.92, duration: 0.25, ease: 'power2.in' }, fillDur)
        .add(markIntroDone, fillDur + 0.05)
        .to(el, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, fillDur + 0.05)
        .to('[data-inner]', { yPercent: 40, opacity: 0, duration: 0.7, ease: 'power2.in' }, fillDur + 0.05)
        .add(finish)
    }, el)
    return () => ctx.revert()
  }, [])

  if (gone) return null
  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-cream" role="status" aria-label={t(COPY.preloader)}>
      <div data-inner className="flex flex-col items-center gap-8">
        <svg data-cup viewBox="0 0 120 110" className="w-[clamp(96px,14vw,150px)]" aria-hidden>
          <defs>
            <clipPath id="cup-clip">
              <path d="M18 30h74l-6 52a18 18 0 0 1-18 16H42a18 18 0 0 1-18-16z" />
            </clipPath>
          </defs>
          <g clipPath="url(#cup-clip)">
            <g data-fill>
              <rect x="10" y="26" width="90" height="80" fill="#8c4b1f" />
              <path d="M10 30c12-5 22 5 34 0s22-5 34 0 18 4 22 0v6H10z" fill="#c98a4b" />
            </g>
          </g>
          <path d="M18 30h74l-6 52a18 18 0 0 1-18 16H42a18 18 0 0 1-18-16z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M91 42h7a10 10 0 0 1 0 20h-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M40 18c-4-5 4-8 0-13M56 18c-4-5 4-8 0-13M72 18c-4-5 4-8 0-13" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="label text-muted-dark">{t(COPY.preloader)}</p>
      </div>
      <p className="font-display tabular absolute bottom-[4vh] right-[var(--gutter)] text-[clamp(4rem,14vw,12rem)] text-cream/90" aria-hidden>
        <span data-count>0</span>
      </p>
    </div>
  )
}
