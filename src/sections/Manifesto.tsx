import { Fragment, useRef } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { gsap } from '../lib/gsap'
import { useIsoLayoutEffect, useReducedMotion } from '../lib/motion'
import { useSectionTheme } from '../lib/theme'
import { Photo } from '../components/Photo'
import { RotatingBadge } from '../components/RotatingBadge'

const PILLS: Record<string, { image: string; alt: { cs: string; en: string } }> = {
  pastry: { image: 'pastry-cinnamon-roll', alt: { cs: 'skořicoví šneci', en: 'cinnamon rolls' } },
  coffee: { image: 'manifesto-latte', alt: { cs: 'cappuccino', en: 'cappuccino' } },
  candle: { image: 'atmosphere-candle', alt: { cs: 'svíčka a latte', en: 'candle and latte' } },
}

export function Manifesto() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useSectionTheme(root, 'cream')

  const tokens = t(COPY.manifesto.text).split(/(\{img:\w+\})/).filter(Boolean)

  useIsoLayoutEffect(() => {
    const el = root.current!
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('[data-word]')
      const pills = el.querySelectorAll('[data-pill]')
      if (!reduced) {
        // Words light up as you read them; photos pop into the sentence.
        gsap
          .timeline({ scrollTrigger: { trigger: '[data-text]', start: 'top 78%', end: 'bottom 52%', scrub: 0.6 } })
          .fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.6 }, 0)
          .fromTo(pills, { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, stagger: 0.9, ease: 'back.out(2)', duration: 0.9 }, 0.3)
        gsap.to('[data-badge-ring]', {
          rotation: 300,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      gsap.from('[data-fact]', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        scrollTrigger: { trigger: '[data-facts]', start: 'top 88%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [lang, reduced])

  return (
    <section ref={root} id="manifesto" aria-labelledby="manifesto-label" className="sec relative px-gutter py-section text-ink [--sec-bg:#f3eadc]">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex items-start justify-between lg:col-span-3 lg:flex-col lg:justify-start lg:gap-16">
          <h2 id="manifesto-label" className="label text-crust">
            {t(COPY.manifesto.label)}
          </h2>
          <RotatingBadge text={COPY.manifesto.badge} className="text-crust" spinClass="will-change-transform" />
        </div>

        <div className="lg:col-span-9">
          <p data-text className="font-display text-[clamp(2.1rem,5.1vw,5.3rem)] leading-[1.04] tracking-[-0.032em]">
            {tokens.map((tok, i) => {
              const pill = tok.match(/^\{img:(\w+)\}$/)
              if (pill && PILLS[pill[1]]) {
                const p = PILLS[pill[1]]
                return (
                  <span
                    key={i}
                    data-pill
                    className="relative mx-[0.12em] inline-block h-[0.78em] w-[1.55em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline will-change-transform"
                  >
                    <Photo name={p.image} alt={t(p.alt)} sizes="160px" className="absolute inset-0" />
                  </span>
                )
              }
              return (
                <Fragment key={i}>
                  {tok.split(/(\s+)/).map((w, j) =>
                    /^\s+$/.test(w) || w === '' ? (
                      w
                    ) : (
                      <span key={j} data-word className="will-change-[opacity]">
                        {w}
                      </span>
                    ),
                  )}
                </Fragment>
              )
            })}
          </p>

          <dl data-facts className="mt-[clamp(4rem,8vw,7rem)] grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-3">
            {COPY.manifesto.facts.map((f, i) => (
              <div key={i} data-fact className="flex flex-col gap-2">
                <dt className="label order-2 text-muted-light">{t(f.label)}</dt>
                <dd className="font-display order-1 text-[clamp(3rem,5.5vw,5rem)] text-crust">
                  {t(f.value)}
                  {i === 0 && <span className="ml-1 align-top text-[0.45em]">★</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
