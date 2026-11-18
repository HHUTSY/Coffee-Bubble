import { lazy, Suspense, useRef, useState } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { SITE } from '../content/site'
import { gsap } from '../lib/gsap'
import { greetingKey, pragueClock } from '../lib/hours'
import { hasFinePointer, onIntro, useIsoLayoutEffect, useNow, useReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/smooth'
import { useSectionTheme } from '../lib/theme'
import { Photo } from '../components/Photo'
import { Magnetic } from '../components/Magnetic'

const SteamCanvas = lazy(() => import('../components/SteamCanvas'))

/** Where the drink's surface sits inside hero-coffee.jpg (0–1). Adjust if you swap the photo. */
const CUP_ANCHOR = { x: 0.53, y: 0.7 }

function Chars({ word }: { word: string }) {
  return (
    <>
      {[...word].map((c, i) => (
        <span key={i} className="char inline-block will-change-transform">
          {c}
        </span>
      ))}
    </>
  )
}

export function Hero() {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)
  const archRef = useRef<HTMLDivElement>(null)
  const [steamOn, setSteamOn] = useState(false)
  const reduced = useReducedMotion()
  const now = useNow(15_000)
  const clock = pragueClock(now)
  useSectionTheme(root, 'night')

  useIsoLayoutEffect(() => {
    const el = root.current!
    let stopIntro = () => {}
    const ctx = gsap.context(() => {
      // Resolve elements up front: the intro callback fires from the preloader's timeline,
      // where string selectors would be scoped to the wrong context.
      const q = gsap.utils.selector(el)
      const chars1 = q('[data-line="1"] .char')
      const chars2 = q('[data-line="2"] .char')
      const archMask = q('[data-arch-mask], [data-arch-inner]')
      const archImg = q('[data-arch-inner] img')
      const fades = q('[data-fade]')

      if (reduced) {
        gsap.set('[data-fade], [data-arch-wrap]', { opacity: 0 })
        stopIntro = onIntro(() => {
          gsap.to([...fades, ...q('[data-arch-wrap]')], { opacity: 1, duration: 0.8, ease: 'power1.out' })
          setSteamOn(true)
        })
        return
      }

      gsap.set([...chars1, ...chars2], { yPercent: 118, rotate: 8 })
      gsap.set('[data-arch-mask]', { yPercent: 101 })
      gsap.set('[data-arch-inner]', { yPercent: -101 })
      gsap.set('[data-arch-inner] img', { scale: 1.4 })
      gsap.set('[data-fade]', { opacity: 0, y: 26 })

      stopIntro = onIntro(() => {
        gsap
          .timeline()
          .to(chars1, { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.06, ease: 'expo.out' }, 0)
          .to(archMask, { yPercent: 0, duration: 1.55, ease: 'expo.inOut' }, 0.05)
          .to(archImg, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0.3)
          .to(chars2, { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.055, ease: 'expo.out' }, 0.32)
          .add(() => setSteamOn(true), 0.7)
          .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out' }, 0.85)
      })

      // Leaving the hero: words drift apart, the window rises.
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
        .to('[data-line="1"]', { xPercent: -9, ease: 'none' }, 0)
        .to('[data-line="2"]', { xPercent: 7, ease: 'none' }, 0)
        .to('[data-arch-wrap]', { yPercent: -22, scale: 1.06, ease: 'none' }, 0)
        .to('[data-fade], [data-out]', { opacity: 0, ease: 'none', duration: 0.5 }, 0)

      // Pointer: the window tilts, the words lean.
      if (hasFinePointer()) {
        const tilt = el.querySelector('[data-arch-tilt]')!
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: 'power3' })
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: 'power3' })
        const l1 = gsap.quickTo('[data-line="1"]', 'x', { duration: 1.4, ease: 'power3' })
        const l2 = gsap.quickTo('[data-line="2"]', 'x', { duration: 1.4, ease: 'power3' })
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          ry(nx * 9)
          rx(-ny * 7)
          l1(nx * -22)
          l2(nx * 22)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      }
    }, el)
    return () => {
      stopIntro()
      ctx.revert()
    }
  }, [reduced])

  const hh = String(clock.hour).padStart(2, '0')
  const mm = String(clock.minute).padStart(2, '0')

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="hero sec-top relative h-[100svh] min-h-[600px] overflow-hidden text-cream [--sec-bg:#15100c]"
    >
      {/* Oven glow behind the window */}
      <div
        aria-hidden
        className="oven-glow pointer-events-none absolute left-1/2 top-[56%] size-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,121,58,0.26),rgba(229,121,58,0.07)_42%,transparent_70%)]"
      />

      <h1 id="hero-title" className="font-display select-none" aria-label="Coffee Bubble">
        <span
          data-line="1"
          aria-hidden
          className="line-mask absolute left-[var(--gutter)] top-[var(--line1-top)] z-[1] whitespace-nowrap text-[length:var(--hero-fs)] will-change-transform"
        >
          <Chars word="Coffee" />
        </span>
        <span
          data-line="2"
          aria-hidden
          className="line-mask font-display-italic absolute right-[var(--gutter)] top-[var(--line2-top)] z-[3] whitespace-nowrap pr-[0.06em] text-[length:var(--hero-fs)] leading-[0.86] text-[#f6d9b8] will-change-transform"
        >
          <Chars word="Bubble" />
        </span>
      </h1>

      {/* The bakery window */}
      <div
        data-arch-wrap
        className="absolute left-1/2 top-[var(--arch-top)] z-[2] w-[var(--arch-w)] -translate-x-1/2 [perspective:1100px] md:left-[54%]"
      >
        <div data-arch-tilt className="will-change-transform [transform-style:preserve-3d]">
          <div ref={archRef} className="arch relative aspect-[3/4.1] overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.75)]">
            <div data-arch-mask className="absolute inset-0 overflow-hidden">
              <div data-arch-inner className="absolute inset-0">
                <Photo
                  name="hero-coffee"
                  alt={t(COPY.hero.photoAlt)}
                  priority
                  sizes="(min-width: 768px) 26vw, 64vw"
                  className="h-full w-full"
                  imgClassName="will-change-transform"
                  imgStyle={{ transformOrigin: '50% 70%' }}
                />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,16,12,0.35)_0%,transparent_30%,transparent_70%,rgba(21,16,12,0.4)_100%)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <SteamCanvas sourceRef={archRef} anchor={CUP_ANCHOR} active={steamOn} className="absolute inset-0 z-[4] h-full w-full mix-blend-screen" />
      </Suspense>

      {/* Left column: kicker + live clock */}
      <div
        data-fade
        className="absolute left-[var(--gutter)] top-[var(--kicker-top)] z-[5] hidden max-w-[16rem] md:block"
      >
        <p className="label text-ember">{t(COPY.hero.kicker)}</p>
        <p className="label mt-2 text-muted-dark">
          Chomutov <span className="tabular text-cream">{hh}:{mm}</span> · {t(COPY.greeting[greetingKey(now)])}
        </p>
      </div>

      {/* Vertical coordinates */}
      <p
        data-fade
        aria-hidden
        className="label absolute right-[var(--gutter)] top-[34%] z-[5] hidden origin-right translate-x-[0.6em] -rotate-90 text-muted-dark lg:block"
      >
        {SITE.geo.lat.toFixed(4)}° N — {SITE.geo.lng.toFixed(4)}° E
      </p>

      {/* Bottom: lead + scroll cue */}
      <div className="absolute inset-x-[var(--gutter)] bottom-[max(4vh,24px)] z-[5] flex flex-col gap-5 md:max-w-[min(30rem,36vw)]">
        <p data-out className="text-lead text-cream/85">
          {t(COPY.hero.lead)}
        </p>
        <div data-fade>
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToTarget('#manifesto')}
              className="label group flex items-center gap-3 text-cream"
            >
              <span className="grid size-11 place-items-center rounded-full border border-cream/35 transition-colors group-hover:bg-cream group-hover:text-ink">
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
                  <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              {t(COPY.hero.scroll)}
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
