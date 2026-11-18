import { useEffect, useRef } from 'react'
import { useLang } from '../content/i18n'
import { gsap, ScrollTrigger } from '../lib/gsap'

const START = 6 * 60 // the page begins before dawn…
const END = 19 * 60 // …and ends when the candles go out

/**
 * The day-cycle made explicit: scrolling the page moves a small clock from 6:00 to 19:00.
 * Desktop only; appears once the hero is behind you.
 */
export function DayDial() {
  const { lang } = useLang()
  const root = useRef<HTMLDivElement>(null)
  const hand = useRef<SVGGElement>(null)
  const time = useRef<HTMLSpanElement>(null)
  const part = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current!
    const parts =
      lang === 'cs'
        ? ['Před svítáním', 'Ráno', 'Dopoledne', 'Poledne', 'Odpoledne', 'Večer']
        : ['Before dawn', 'Morning', 'Late morning', 'Noon', 'Afternoon', 'Evening']
    const rot = gsap.quickSetter(hand.current, 'rotation', 'deg')
    let shown = false
    const update = (p: number) => {
      const m = Math.round(START + p * (END - START))
      const h = Math.floor(m / 60)
      time.current!.textContent = `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
      part.current!.textContent = parts[h < 7 ? 0 : h < 10 ? 1 : h < 12 ? 2 : h < 13 ? 3 : h < 18 ? 4 : 5]
      rot((m / 720) * 360)
      const inProcess = ScrollTrigger.getById('process')?.isActive ?? false
      const show = window.scrollY > window.innerHeight * 0.8 && !inProcess
      if (show !== shown) {
        shown = show
        gsap.to(el, { autoAlpha: show ? 1 : 0, y: show ? 0 : 12, duration: 0.6, ease: 'power3.out' })
      }
    }
    gsap.set(el, { autoAlpha: 0, y: 12 })
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => update(self.progress) })
    update(st.progress)
    return () => st.kill()
  }, [lang])

  return (
    <div
      ref={root}
      aria-hidden
      className="nav pointer-events-none fixed bottom-5 left-[var(--gutter)] z-[50] hidden items-center gap-3 rounded-full bg-[color-mix(in_srgb,var(--theme-bg,#15100c)_72%,transparent)] py-1.5 pl-1.5 pr-4 backdrop-blur-md lg:flex"
    >
      <svg viewBox="0 0 40 40" className="size-9">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="20" y1="3.5" x2="20" y2={i % 3 === 0 ? 7 : 5.5} stroke="currentColor" strokeOpacity="0.6" transform={`rotate(${i * 30} 20 20)`} />
        ))}
        <g ref={hand} style={{ transformOrigin: '20px 20px' }}>
          <line x1="20" y1="20" x2="20" y2="8" stroke="#E5793A" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <circle cx="20" cy="20" r="2" fill="#E5793A" />
      </svg>
      <span className="label leading-tight">
        <span ref={time} className="tabular block text-[0.8rem]">06:00</span>
        <span ref={part} className="block opacity-60" />
      </span>
    </div>
  )
}
