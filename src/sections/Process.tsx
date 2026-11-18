import { useRef, useState } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { PROCESS, type ProcessStage } from '../content/stories'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useIsoLayoutEffect, useReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/smooth'
import { setScrim, setTheme, setTone } from '../lib/theme'
import { BeansArt, CremaArt, CupArt, GroundsArt } from '../components/ProcessArt'
import { Photo } from '../components/Photo'

function StageArt({ stage, alt }: { stage: ProcessStage; alt: string }) {
  if (stage.key === 'cup') return <CupArt image={stage.image ?? 'process-cup'} alt={alt} />
  if (stage.image) return <Photo name={stage.image} alt={alt} sizes="(min-width: 1024px) 40vw, 80vw" className="size-full" />
  if (stage.key === 'bean') return <BeansArt variant="green" />
  if (stage.key === 'roast') return <BeansArt variant="roast" />
  if (stage.key === 'grind') return <GroundsArt />
  return <CremaArt />
}

const textColor = (s: ProcessStage) => (s.tone === 'light' ? '#F3EADC' : '#15100C')

/**
 * Pinned scene: five chapters (bean → roast → grind → extraction → cup).
 * Scroll scrubs colour, text masks and a "lens" that fills from below like a cup.
 */
export function Process() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const N = PROCESS.length

  useIsoLayoutEffect(() => {
    if (reduced) return
    const el = root.current!
    let current = -1
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      const bgs = q('[data-bg]')
      const texts = q('[data-stage-text]')
      const arts = q('[data-art]')
      const chrome = q('[data-chrome]')

      gsap.set(bgs.slice(1), { opacity: 0 })
      texts.slice(1).forEach((tx) => gsap.set(tx.querySelectorAll('[data-rise]'), { yPercent: 110, opacity: 0 }))
      arts.slice(1).forEach((art, i) => {
        if (PROCESS[i + 1].key === 'roast') gsap.set(art, { opacity: 0 })
        else {
          gsap.set(art, { yPercent: 100 })
          gsap.set(art.firstElementChild, { yPercent: -100 })
        }
      })
      gsap.set(q('[data-stream]'), { scaleY: 0 })

      const apply = (i: number) => {
        if (i === current) return
        current = i
        setActive(i)
        const s = PROCESS[i]
        gsap.to(chrome, { color: textColor(s), duration: 0.5, overwrite: true })
        setTone(s.tone === 'light' ? 'dark' : 'light')
        setScrim(s.bg)
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'process',
          trigger: el,
          pin: true,
          start: 'top top',
          end: () => `+=${window.innerHeight * (N - 1) * 0.95}`,
          scrub: 0.7,
          invalidateOnRefresh: true,
          snap: { snapTo: 'labelsDirectional', inertia: false, duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: 'power2.inOut' },
          onToggle: (self) => {
            if (self.isActive) {
              setTheme('night')
              current = -1
              apply(Math.round(self.progress * (N - 1)))
            }
          },
          onUpdate: (self) => {
            if (self.isActive) apply(Math.round(self.progress * (N - 1)))
          },
        },
      })
      stRef.current = tl.scrollTrigger ?? null

      tl.addLabel('s0', 0)
      for (let i = 1; i < N; i++) {
        const at = i - 0.62
        const D = 0.6
        tl.to(bgs[i], { opacity: 1, duration: D, ease: 'power1.inOut' }, at)
        tl.to(texts[i - 1].querySelectorAll('[data-rise]'), { yPercent: -110, opacity: 0, stagger: 0.03, duration: 0.3, ease: 'power2.in' }, at)
        tl.to(texts[i].querySelectorAll('[data-rise]'), { yPercent: 0, opacity: 1, stagger: 0.045, duration: 0.36, ease: 'power3.out' }, at + 0.24)
        if (PROCESS[i].key === 'roast') {
          tl.to(arts[i], { opacity: 1, duration: D, ease: 'power1.inOut' }, at)
        } else {
          tl.to(arts[i], { yPercent: 0, duration: D, ease: 'power2.inOut' }, at)
          tl.to(arts[i].firstElementChild, { yPercent: 0, duration: D, ease: 'power2.inOut' }, at)
        }
        tl.addLabel(`s${i}`, i)
      }
      // Continuous motion across the whole scene
      tl.to(q('[data-ring]'), { rotation: 300, duration: N - 1 }, 0)
      tl.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, duration: N - 1 }, 0)
      // Parallax inside each chapter, clamped to the scene so labels keep mapping to progress.
      arts.forEach((art, i) => {
        const inner = art.querySelector('[data-par]')
        const from = Math.max(0, i - 0.8)
        const to = Math.min(N - 1, i + 0.8)
        if (!inner) return
        // the final cup settles exactly centred and unzoomed
        if (PROCESS[i].key === 'cup') tl.fromTo(inner, { scale: 1.1 }, { scale: 1, duration: to - from }, from)
        else tl.fromTo(inner, { yPercent: 7, scale: 1.12 }, { yPercent: -7, scale: 1.02, duration: to - from }, from)
      })
      const extractIdx = PROCESS.findIndex((s) => s.key === 'extract')
      if (extractIdx > 0) tl.to(q('[data-stream]'), { scaleY: 1, duration: 0.5, ease: 'power2.out' }, extractIdx - 0.25)
    }, el)
    return () => {
      stRef.current = null
      ctx.revert()
    }
  }, [lang, reduced])

  const goTo = (i: number) => {
    const st = stRef.current
    if (!st) return
    scrollToTarget(st.start + ((st.end - st.start) * i) / (N - 1))
  }

  if (reduced) return <ProcessStatic />

  return (
    <section
      ref={root}
      id="process"
      aria-labelledby="process-heading"
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
    >
      {PROCESS.map((s) => (
        <div key={s.key} data-bg aria-hidden className="absolute inset-0" style={{ background: s.bg }} />
      ))}
      {/* faint vignette for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_50%,transparent_40%,rgba(0,0,0,0.28)_100%)]" />

      <div className="relative z-10 mx-auto grid h-full grid-rows-[auto_1fr_auto] px-gutter pb-6 pt-[calc(var(--nav-h)+1.5rem)]">
        <div data-chrome className="flex items-baseline justify-between gap-6" style={{ color: textColor(PROCESS[0]) }}>
          <p className="label">{t(COPY.process.label)}</p>
          <h2 id="process-heading" className="font-display-italic hidden text-h3 sm:block">
            {t(COPY.process.heading)}
          </h2>
        </div>

        <div className="grid min-h-0 items-center gap-6 lg:grid-cols-[1fr_minmax(0,1.05fr)] lg:gap-[6vw]">
          {/* Text chapters */}
          <div className="relative order-2 h-[clamp(220px,40svh,440px)] lg:order-1">
            {PROCESS.map((s, i) => (
              <div
                key={s.key}
                data-stage-text
                aria-hidden={i !== active}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ color: textColor(s) }}
              >
                <div className="line-mask">
                  <p data-rise className="font-display tabular text-[clamp(3.5rem,9vw,9rem)] leading-[0.8] opacity-25">
                    0{i + 1}
                  </p>
                </div>
                <div className="line-mask mt-1">
                  <h3 data-rise className="font-display text-[clamp(3rem,8.4vw,8.6rem)]">
                    {t(s.title)}
                  </h3>
                </div>
                <div className="line-mask mt-5">
                  <p data-rise className="text-lead max-w-[30rem] opacity-90">
                    {t(s.text)}
                  </p>
                </div>
                <div className="line-mask mt-5">
                  <p data-rise className="label opacity-75">
                    {t(s.spec)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* The lens */}
          <div className="relative order-1 mx-auto aspect-square w-[min(64vw,38svh)] lg:order-2 lg:w-[min(40vw,66svh)]">
            <svg data-ring data-chrome viewBox="0 0 200 200" className="absolute inset-0 size-full will-change-transform" aria-hidden style={{ color: textColor(PROCESS[0]) }}>
              <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.4" />
              {Array.from({ length: 60 }, (_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="2"
                  x2="100"
                  y2={i % 5 === 0 ? 7 : 4.5}
                  stroke="currentColor"
                  strokeOpacity={i % 5 === 0 ? 0.7 : 0.35}
                  strokeWidth="0.5"
                  transform={`rotate(${i * 6} 100 100)`}
                />
              ))}
            </svg>
            <div className="absolute inset-[7%] overflow-hidden rounded-full [clip-path:circle(50%_at_50%_50%)]">
              {PROCESS.map((s) => (
                <div key={s.key} data-art className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0">
                    <div data-par className={s.key === 'cup' ? 'absolute inset-0' : 'absolute -inset-[11%]'}>
                      <StageArt stage={s} alt={t(s.title)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter progress */}
        <div data-chrome className="mt-4" style={{ color: textColor(PROCESS[0]) }}>
          <div className="relative h-px w-full bg-current/20">
            <div data-progress className="absolute inset-0 origin-left bg-current" />
          </div>
          <ol className="mt-3 grid grid-cols-5 gap-2">
            {PROCESS.map((s, i) => (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={`label w-full text-left transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
                >
                  <span className="sr-only">{t(COPY.process.goTo)} </span>
                  <span className="tabular">0{i + 1}</span>
                  <span className="sr-only sm:not-sr-only sm:ml-2">{t(s.title)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/** Reduced motion: the same story as a calm vertical list. */
function ProcessStatic() {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)
  useIsoLayoutEffect(() => {
    const st = ScrollTrigger.create({ trigger: root.current, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setTheme('night') })
    return () => st.kill()
  }, [])
  return (
    <section ref={root} id="process" aria-labelledby="process-heading">
      <h2 id="process-heading" className="sr-only">
        {t(COPY.process.label)}
      </h2>
      {PROCESS.map((s, i) => (
        <article key={s.key} className="grid items-center gap-10 px-gutter py-24 md:grid-cols-2" style={{ background: s.bg, color: textColor(s) }}>
          <div>
            <p className="font-display text-[5rem] leading-none opacity-30">0{i + 1}</p>
            <h3 className="font-display text-[clamp(3rem,7vw,6rem)]">{t(s.title)}</h3>
            <p className="text-lead mt-4 max-w-md">{t(s.text)}</p>
            <p className="label mt-4 opacity-75">{t(s.spec)}</p>
          </div>
          <div className="mx-auto aspect-square w-[min(80vw,420px)] overflow-hidden rounded-full">
            <StageArt stage={s} alt={t(s.title)} />
          </div>
        </article>
      ))}
    </section>
  )
}
