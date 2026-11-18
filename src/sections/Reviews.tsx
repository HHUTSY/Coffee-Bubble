import { useEffect, useRef, useState } from 'react'
import { COPY, fill } from '../content/copy'
import { useLang } from '../content/i18n'
import { SITE } from '../content/site'
import { REVIEWS } from '../content/stories'
import { gsap, SplitText } from '../lib/gsap'
import { useIsoLayoutEffect, useReducedMotion } from '../lib/motion'
import { useSectionTheme } from '../lib/theme'
import { Magnetic } from '../components/Magnetic'

const AUTOPLAY_MS = 7000

function Stars({ value }: { value: number }) {
  return (
    <span className="relative inline-block text-[1.4rem] leading-none tracking-[0.15em]" aria-hidden>
      <span className="text-ink/20">★★★★★</span>
      <span className="absolute inset-0 overflow-hidden whitespace-nowrap text-crust" style={{ width: `${(value / 5) * 100}%` }}>
        ★★★★★
      </span>
    </span>
  )
}

export function Reviews() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const N = REVIEWS.length
  const review = REVIEWS[index]
  useSectionTheme(root, 'latte')

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + N) % N)

  // Autoplay (off for reduced motion, paused on hover/focus)
  useEffect(() => {
    if (reduced || paused) return
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [index, paused, reduced])

  // The giant quote mark turns slowly as the section passes.
  useIsoLayoutEffect(() => {
    if (reduced) return
    const tw = gsap.fromTo(
      root.current!.querySelector("[data-glyph]"),
      { rotate: -10, yPercent: -8 },
      { rotate: 8, yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
    )
    return () => {
      tw.scrollTrigger?.kill()
      tw.kill()
    }
  }, [reduced])

  // Each quote rises in word by word.
  useIsoLayoutEffect(() => {
    const el = quoteRef.current
    if (!el) return
    if (reduced) {
      const tw = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      return () => {
        tw.kill()
      }
    }
    const split = SplitText.create(el, { type: 'words', mask: 'words', aria: 'none' })
    const tw = gsap.from(split.words, { yPercent: 110, rotate: 4, duration: 1.1, stagger: 0.025, ease: 'expo.out' })
    return () => {
      tw.kill()
      split.revert()
    }
  }, [index, lang, reduced])

  return (
    <section
      ref={root}
      id="reviews"
      aria-labelledby="reviews-heading"
      className="sec relative overflow-hidden px-gutter py-section text-ink [--sec-bg:#dcc6a8]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span
        aria-hidden
        data-glyph
        className="font-display pointer-events-none absolute right-[2vw] top-[4vw] select-none text-[clamp(18rem,42vw,44rem)] leading-[0.62] text-crust/[0.13] will-change-transform"
      >
        “
      </span>
      <div className="relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="label text-crust">{t(COPY.reviews.label)}</p>
          <h2 id="reviews-heading" className="font-display mt-6 text-h3">
            {t(COPY.reviews.heading)}
          </h2>
          <div className="mt-10">
            <p className="font-display text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.85] text-crust">
              {SITE.rating.value.toLocaleString(lang === 'cs' ? 'cs-CZ' : 'en-GB')}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Stars value={SITE.rating.value} />
              <span className="sr-only">
                {SITE.rating.value} / 5
              </span>
            </div>
            <p className="label mt-3 text-muted-light">
              {t(COPY.reviews.ratingLabel)} · {fill(t(COPY.reviews.count), { n: SITE.rating.count })}
            </p>
            <a href={SITE.maps.google} target="_blank" rel="noreferrer" className="label link-underline mt-6 inline-block text-crust">
              {t(COPY.reviews.readAll)} ↗
            </a>
          </div>
        </div>

        <div
          className="flex flex-col lg:col-span-9"
          role="region"
          aria-roledescription="carousel"
          aria-label={t(COPY.reviews.carousel)}
        >
          <figure className="min-h-[clamp(14rem,30vw,24rem)]" aria-live={paused ? 'polite' : 'off'}>
            <blockquote>
              <p
                key={`${index}-${lang}`}
                ref={quoteRef}
                className="font-display text-[clamp(2.1rem,4.6vw,4.7rem)] leading-[1.02] tracking-[-0.03em]"
              >
                <span aria-hidden className="mr-[0.1em] text-crust">„</span>
                {t(review.quote)}
                <span aria-hidden className="text-crust">“</span>
              </p>
            </blockquote>
            <figcaption className="label mt-8 flex flex-wrap items-center gap-3 text-muted-light">
              <span>— {review.author} · {review.source}</span>
              {review.sample && (
                <span className="rounded-full border border-crust/40 px-2.5 py-1 text-crust">
                  {lang === 'cs' ? 'Ukázkový text — nahraďte skutečnou recenzí' : 'Sample text — replace with a real review'}
                </span>
              )}
            </figcaption>
          </figure>

          <div className="mt-12 flex items-center gap-6">
            <Magnetic>
              <button type="button" onClick={() => go(-1)} aria-label={t(COPY.reviews.prev)} className="grid size-14 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-cream">
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                  <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => go(1)} aria-label={t(COPY.reviews.next)} className="grid size-14 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-cream">
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                  <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </Magnetic>
            <p className="label tabular text-muted-light" aria-hidden>
              {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </p>
            <div className="relative ml-auto h-px w-[min(16rem,30vw)] overflow-hidden bg-ink/15" aria-hidden>
              {!reduced && (
                <span
                  key={`${index}-${paused}`}
                  className="absolute inset-0 origin-left bg-ink"
                  style={{ animation: paused ? 'none' : `review-progress ${AUTOPLAY_MS}ms linear both`, transform: paused ? 'scaleX(0)' : undefined }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
