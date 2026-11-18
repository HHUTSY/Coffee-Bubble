import { useEffect, useRef } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { MENU, type MenuItem } from '../content/menu'
import { cafeAudio } from '../lib/audio'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { hasFinePointer, prefersReducedMotion, useIsoLayoutEffect } from '../lib/motion'
import { scrollToTarget } from '../lib/smooth'
import { setTheme } from '../lib/theme'
import { Photo } from '../components/Photo'
import { Magnetic } from '../components/Magnetic'

const CRUMBS = 9

function PastryCard({ item, index, total }: { item: MenuItem; index: number; total: number }) {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const card = ref.current!
    const tilt = card.querySelector<HTMLElement>('[data-tilt]')!
    const crumbs = card.querySelectorAll('[data-crumb]')
    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.7, ease: 'power3' })
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.7, ease: 'power3' })
    const move = (e: PointerEvent) => {
      const r = tilt.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 16)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
    }
    // "Crunch": a tiny squash, crumbs fly off, and a crackle if the sound is on.
    const enter = () => {
      gsap.fromTo(tilt, { scale: 0.955 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.42)', overwrite: 'auto' })
      crumbs.forEach((c) =>
        gsap.fromTo(
          c,
          { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
          {
            x: gsap.utils.random(-130, 130),
            y: gsap.utils.random(-190, -50),
            rotation: gsap.utils.random(-220, 220),
            opacity: 0,
            scale: 0.3,
            duration: gsap.utils.random(0.6, 1.05),
            ease: 'power3.out',
          },
        ),
      )
      cafeAudio.crunch()
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    card.addEventListener('pointermove', move)
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    return () => {
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <article
      ref={ref}
      data-card
      data-cursor={t(COPY.pastry.cursor)}
      className="relative w-[min(29vw,440px)] shrink-0 max-md:w-[76vw] max-md:snap-center"
    >
      <div className="[perspective:1000px]">
        <div data-tilt className="relative aspect-[4/5] will-change-transform [transform-style:preserve-3d]">
          <div className="absolute inset-0 overflow-hidden rounded-[clamp(18px,2vw,30px)] bg-crust">
            <div data-img className="absolute inset-y-0 -left-[9%] -right-[9%]">
              <Photo name={item.image!} alt={t(item.alt ?? item.name)} sizes="(min-width: 768px) 30vw, 76vw" className="size-full" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,16,12,0.35)_0%,transparent_28%,transparent_62%,rgba(21,16,12,0.55)_100%)]" />
            <p className="label absolute left-4 top-4 text-cream" aria-hidden>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
          </div>
          <span
            className="font-display absolute -right-3 -top-3 grid size-[clamp(64px,6vw,86px)] place-items-center rounded-full bg-ember text-center text-[clamp(1rem,1.4vw,1.3rem)] leading-none text-ink shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] [transform:translateZ(46px)]"
          >
            <span>
              {item.price}
              <span className="label mt-1 block text-[0.6rem]">{t(COPY.menu.currency)}</span>
            </span>
          </span>
          <span aria-hidden className="pointer-events-none absolute bottom-[22%] left-1/2 [transform:translateZ(30px)]">
            {Array.from({ length: CRUMBS }, (_, i) => (
              <span
                key={i}
                data-crumb
                className="absolute block rounded-[2px] opacity-0"
                style={{
                  width: 3 + (i % 3) * 2,
                  height: 2 + (i % 2) * 2,
                  background: i % 3 === 0 ? '#F3EADC' : i % 3 === 1 ? '#C98A4B' : '#8C4B1F',
                }}
              />
            ))}
          </span>
        </div>
      </div>
      <h3 className="font-display mt-6 text-h3 leading-[1.02]">{t(item.name)}</h3>
      <p className="mt-2 max-w-[36ch] text-[0.98rem] leading-relaxed text-muted-light">{t(item.note)}</p>
    </article>
  )
}

/** Horizontal gallery driven by vertical scroll (desktop); native swipe on phones. */
export function Pastry() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const items = MENU.filter((i) => i.featured && i.image)

  useIsoLayoutEffect(() => {
    const el = root.current!
    const tr = track.current!
    const mm = gsap.matchMedia()
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        other: '(max-width: 767px), (prefers-reduced-motion: reduce)',
      },
      (c) => {
        if (c.conditions?.desktop) {
          const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth)
          const horizontal = gsap.to(tr, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              pin: true,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onToggle: (s) => s.isActive && setTheme('dough'),
            },
          })
          tr.querySelectorAll('[data-card]').forEach((card) => {
            gsap.fromTo(
              card.querySelector('[data-img]'),
              { xPercent: -7 },
              {
                xPercent: 7,
                ease: 'none',
                scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true },
              },
            )
            gsap.from(card, {
              yPercent: 12,
              rotate: 2.5,
              opacity: 0,
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 92%', toggleActions: 'play none none reverse' },
            })
          })
        } else {
          ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setTheme('dough') })
        }
      },
    )
    return () => mm.revert()
  }, [lang])

  return (
    <section ref={root} id="pastry" aria-label={t(COPY.pastry.heading)} className="sec relative overflow-hidden text-ink [--sec-bg:#eadbc4] md:h-[100svh] md:[background:var(--sec-bg)]">
      <div className="flex h-full flex-col justify-center gap-10 py-[calc(var(--nav-h)+1rem)] md:py-0">
        <header className="px-gutter md:hidden">
          <p className="label text-crust">{t(COPY.pastry.label)}</p>
          <h2 className="font-display mt-5 text-[clamp(2.6rem,11vw,3.4rem)] leading-[0.92]">{t(COPY.pastry.heading)}</h2>
          <p className="mt-5 text-muted-light">{t(COPY.pastry.sub)}</p>
          <p className="label mt-6 flex items-center gap-3 text-crust" aria-hidden>
            {t(COPY.pastry.swipe)}
            <svg viewBox="0 0 40 10" className="h-2.5 w-10">
              <path d="M0 5h38M33 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </p>
        </header>
        <div
          ref={track}
          className="flex items-end gap-[clamp(28px,4vw,72px)] px-gutter will-change-transform max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pt-8 max-md:pb-6 motion-reduce:snap-x motion-reduce:overflow-x-auto motion-reduce:pt-8 motion-reduce:pb-6 md:pr-[12vw] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <header className="hidden w-[min(36rem,84vw)] shrink-0 flex-col self-center md:flex md:pr-[3vw]">
            <p className="label text-crust">{t(COPY.pastry.label)}</p>
            <h2 className="font-display mt-6 text-[clamp(3rem,6.4vw,6.6rem)] leading-[0.9]">
              {t(COPY.pastry.heading)}
            </h2>
            <p className="text-lead mt-8 max-w-[30rem] text-muted-light">{t(COPY.pastry.sub)}</p>
            <p className="label mt-10 hidden items-center gap-3 text-crust md:flex" aria-hidden>
              {t(COPY.pastry.drag)}
              <svg viewBox="0 0 40 10" className="h-2.5 w-10">
                <path d="M0 5h38M33 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </p>
          </header>

          {items.map((item, i) => (
            <PastryCard key={item.id} item={item} index={i} total={items.length} />
          ))}

          <div className="flex w-[min(24rem,70vw)] shrink-0 flex-col justify-end self-center max-md:snap-center">
            <Magnetic strength={0.25}>
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget('#menu')
                }}
                data-cursor="Menu"
                className="font-display-italic group flex items-center gap-4 text-[clamp(2.4rem,4.4vw,4.4rem)] leading-none text-crust"
              >
                {t(COPY.nav.menu)}
                <span className="grid size-[1.1em] place-items-center rounded-full border border-current transition-transform duration-500 group-hover:rotate-45">
                  <svg viewBox="0 0 16 16" className="size-[0.4em]" aria-hidden>
                    <path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
