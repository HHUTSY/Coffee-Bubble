import { useRef } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { bakeState } from '../lib/hours'
import { gsap } from '../lib/gsap'
import { useIsoLayoutEffect, useNow } from '../lib/motion'
import { useSectionTheme } from '../lib/theme'
import { RevealLines } from '../components/RevealLines'

function Digits({ value }: { value: number }) {
  const s = String(value).padStart(2, '0')
  return (
    <span className="inline-flex">
      {[...s].map((d, i) => (
        <span key={`${i}-${d}`} className="digit-in inline-block w-[0.62em] text-center">
          {d}
        </span>
      ))}
    </span>
  )
}

/** "Out of the oven every morning at 7:00" with a live countdown to the next tray (Prague time). */
export function Oven() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const now = useNow(1000)
  const { fresh, secondsToNext } = bakeState(now)
  const h = Math.floor(secondsToNext / 3600)
  const m = Math.floor((secondsToNext % 3600) / 60)
  const s = secondsToNext % 60
  const units = COPY.pastry.oven.units[lang]
  useSectionTheme(root, 'oven')

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-timer]', {
        y: 60,
        opacity: 0,
        duration: 1.4,
        scrollTrigger: { trigger: '[data-timer]', start: 'top 88%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="oven" aria-labelledby="oven-heading" className="sec relative overflow-hidden px-gutter py-section text-cream [--sec-bg:#1b110b]">
      <div
        aria-hidden
        className="oven-glow pointer-events-none absolute left-[62%] top-1/2 size-[86vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,121,58,0.4),rgba(229,121,58,0.1)_45%,transparent_70%)]"
      />
      <div className="relative grid items-end gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="label flex items-center gap-2 text-ember">
            <span className="relative inline-flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-ember" />
            </span>
            {t(COPY.pastry.oven.label)}
          </p>
          <RevealLines as="h2" id="oven-heading" className="font-display mt-6 text-display">
            {t(COPY.pastry.oven.title)}
          </RevealLines>
          <p className="label mt-10 text-muted-dark">{t(COPY.pastry.oven.items)}</p>
        </div>

        <div data-timer className="lg:col-span-6 lg:pl-[4vw]">
          <p className="label text-muted-dark" aria-live="polite">
            {fresh ? <span className="text-ember">{t(COPY.pastry.oven.fresh)}</span> : t(COPY.pastry.oven.next)}
          </p>
          <p
            className="font-display tabular mt-4 flex items-start text-[clamp(3.4rem,8vw,8.4rem)] leading-[0.85] tracking-[-0.04em]"
            role="timer"
            aria-label={`${h} ${units[0]} ${m} ${units[1]}`}
          >
            <span className="flex flex-col">
              <Digits value={h} />
              <span className="label mt-3 text-muted-dark">{units[0]}</span>
            </span>
            <span aria-hidden className="px-[0.08em] text-ember/70">:</span>
            <span className="flex flex-col">
              <Digits value={m} />
              <span className="label mt-3 text-muted-dark">{units[1]}</span>
            </span>
            <span aria-hidden className="px-[0.08em] text-ember/70">:</span>
            <span className="flex flex-col text-ember">
              <Digits value={s} />
              <span className="label mt-3 text-muted-dark">{units[2]}</span>
            </span>
          </p>
          <p className="mt-10 max-w-[28rem] text-muted-dark">{t(COPY.pastry.oven.note)}</p>
        </div>
      </div>
    </section>
  )
}
