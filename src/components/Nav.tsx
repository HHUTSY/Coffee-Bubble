import { useEffect, useRef, useState } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { SITE } from '../content/site'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { lockScroll, scrollToTarget } from '../lib/smooth'
import { prefersReducedMotion } from '../lib/motion'
import { LogoMark, Wordmark } from './Logo'
import { StatusPill } from './StatusPill'
import { LangToggle, SoundToggle } from './Toggles'
import { Magnetic } from './Magnetic'

const LINKS = [
  { href: '#pastry', key: 'pastry' },
  { href: '#menu', key: 'menu' },
  { href: '#atmosphere', key: 'atmosphere' },
  { href: '#visit', key: 'visit' },
] as const

export function Nav() {
  const { t } = useLang()
  const bar = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const toggleBtn = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    const el = bar.current!
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const hide = self.direction === 1 && self.scroll() > window.innerHeight * 0.6
        el.classList.toggle('is-scrolled', self.scroll() > 80)
        gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
      },
    })
    return () => st.kill()
  }, [])

  // Mobile overlay
  const firstRun = useRef(true)
  useEffect(() => {
    const el = panel.current!
    if (firstRun.current) {
      firstRun.current = false
      gsap.set(el, { yPercent: -100, visibility: 'hidden' })
      return
    }
    const links = el.querySelectorAll('[data-nav-item]')
    const reduced = prefersReducedMotion()
    lockScroll(open)
    if (open) {
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(el, { yPercent: -100 }, { yPercent: 0, duration: reduced ? 0.01 : 0.9, ease: 'expo.inOut' })
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, stagger: 0.06, delay: reduced ? 0 : 0.35, duration: reduced ? 0.01 : 1 })
      ;(el.querySelector('a') as HTMLElement | null)?.focus({ preventScroll: true })
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
    gsap.to(el, {
      yPercent: -100,
      duration: reduced ? 0.01 : 0.7,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(el, { visibility: 'hidden' })
      },
    })
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const wasOpen = open
    setOpen(false)
    if (wasOpen) toggleBtn.current?.focus({ preventScroll: true })
    window.setTimeout(() => scrollToTarget(href), wasOpen ? 450 : 0)
  }

  return (
    <>
      <header ref={bar} className={`nav fixed inset-x-0 top-0 z-[60] px-gutter ${open ? '!text-cream [--logo-cut:#15100c]' : ''}`}>
        <div className="flex h-[var(--nav-h)] items-center justify-between gap-4">
          <a href="#top" onClick={go('#top')} aria-label={t(COPY.nav.home)} className="flex items-center gap-3">
            <LogoMark className="size-9" />
            <Wordmark className="hidden sm:inline" />
          </a>

          <nav aria-label="Navigace" className="hidden lg:block">
            <ul className="label flex items-center gap-8">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={go(l.href)} className="link-underline py-1">
                    {t(COPY.nav[l.key])}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <StatusPill compact />
            </div>
            <LangToggle />
            <SoundToggle />
            <button
              ref={toggleBtn}
              type="button"
              className="label flex h-9 items-center gap-2 rounded-full bg-ember px-4 text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              title={t(open ? COPY.nav.close : COPY.nav.open)}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden className="relative block h-2.5 w-4">
                <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
              </span>
              {t(COPY.nav.menu)}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={panel}
        className="invisible fixed inset-0 z-[55] flex flex-col justify-between bg-ink px-gutter pb-10 pt-[calc(var(--nav-h)+2rem)] text-cream lg:hidden"
        aria-hidden={!open}
      >
        <nav aria-label="Navigace (mobil)">
          <ul className="space-y-1">
            {LINKS.map((l, i) => (
              <li key={l.href} className="line-mask">
                <a
                  data-nav-item
                  href={l.href}
                  onClick={go(l.href)}
                  tabIndex={open ? 0 : -1}
                  className="font-display flex items-baseline gap-4 text-[clamp(3rem,15vw,6rem)] leading-[1.02]"
                >
                  <span className="label text-ember">0{i + 1}</span>
                  {t(COPY.nav[l.key])}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-5">
          <StatusPill />
          <Magnetic>
            <a href={SITE.instagram.url} tabIndex={open ? 0 : -1} className="label link-underline" target="_blank" rel="noreferrer">
              Instagram {SITE.instagram.handle}
            </a>
          </Magnetic>
        </div>
      </div>
    </>
  )
}
