import { useRef, useState } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { SITE } from '../content/site'
import { INSTAGRAM_TILES } from '../content/stories'
import { gsap } from '../lib/gsap'
import { pragueClock, prettyTime, toMinutes } from '../lib/hours'
import { useIsoLayoutEffect, useNow, useReducedMotion } from '../lib/motion'
import { useSectionTheme } from '../lib/theme'
import { Photo } from '../components/Photo'
import { Magnetic } from '../components/Magnetic'
import { RevealLines } from '../components/RevealLines'
import { StatusDot, useOpenLabel } from '../components/StatusPill'

/** Timeline scale for the opening-hours chart: 6:00 → 21:00 */
const SCALE_FROM = 6 * 60
const SCALE_SPAN = 15 * 60

function MapCard() {
  const { t } = useLang()
  const [loaded, setLoaded] = useState(false)
  const { lat, lng } = SITE.geo
  const bbox = [lng - 0.0045, lat - 0.0022, lng + 0.0045, lat + 0.0022].map((n) => n.toFixed(5)).join('%2C')
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-cream/12 bg-[#1a120d] lg:aspect-auto lg:h-full lg:min-h-[340px]">
      {loaded ? (
        <iframe
          title={t(COPY.visit.mapTitle)}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
          className="absolute inset-0 size-full [filter:grayscale(1)_invert(0.92)_sepia(0.45)_hue-rotate(-10deg)_contrast(0.92)_brightness(0.95)]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(243,234,220,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(243,234,220,0.06)_1px,transparent_1px)] [background-size:44px_44px]"
          />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(229,121,58,0.22),transparent_70%)]" />
          <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-ember/50" />
            <span className="relative block size-4 rounded-full bg-ember shadow-[0_0_0_6px_rgba(229,121,58,0.25)]" />
          </div>
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
            <p className="label tabular text-cream/60">
              {lat.toFixed(4)}° N
              <br />
              {lng.toFixed(4)}° E
            </p>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="label rounded-full bg-cream px-4 py-2.5 text-ink transition-colors hover:bg-ember"
              >
                {t(COPY.visit.showMap)}
              </button>
              <p className="mt-2 max-w-[16rem] text-[0.72rem] leading-snug text-cream/45">{t(COPY.visit.mapNote)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function Visit() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const now = useNow(30_000)
  const clock = pragueClock(now)
  const today = clock.dow
  const nowMin = clock.hour * 60 + clock.minute
  const nowPos = nowMin >= SCALE_FROM && nowMin <= SCALE_FROM + SCALE_SPAN ? (nowMin - SCALE_FROM) / SCALE_SPAN : null
  const status = useOpenLabel()
  const days = COPY.days[lang]
  useSectionTheme(root, 'evening')

  useIsoLayoutEffect(() => {
    const el = root.current!
    const ctx = gsap.context(() => {
      if (reduced) return
      const chars = gsap.utils.selector(el)('[data-final] .char')
      gsap.from(chars, {
        yPercent: 110,
        rotate: 6,
        stagger: 0.025,
        ease: 'expo.out',
        duration: 1.3,
        scrollTrigger: { trigger: '[data-final]', start: 'top 85%', once: true },
      })
      gsap.from('[data-insta] a', {
        y: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 1.1,
        scrollTrigger: { trigger: '[data-insta]', start: 'top 90%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [lang, reduced])

  const finalWords = t(COPY.visit.final).split(' ')

  return (
    <section ref={root} id="visit" aria-labelledby="visit-heading" className="sec relative overflow-hidden px-gutter pt-section text-cream [--sec-bg:#100b08] [background:linear-gradient(180deg,transparent_0,var(--sec-bg)_var(--fade))]">
      {/* candlelight */}
      <div aria-hidden className="oven-glow pointer-events-none absolute -right-[20vmax] top-[10%] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgba(229,121,58,0.2),transparent_70%)]" />

      <div className="relative grid gap-10 lg:grid-cols-12">
        <p className="label text-ember lg:col-span-3">{t(COPY.visit.label)}</p>
        <RevealLines as="h2" id="visit-heading" className="font-display text-h2 leading-[0.92] lg:col-span-9">
          {t(COPY.visit.heading)}
        </RevealLines>
      </div>

      <div className="relative mt-[clamp(3.5rem,7vw,6rem)] grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Status + address */}
        <div className="flex flex-col gap-10 lg:col-span-4">
          <div>
            <p className="flex items-center gap-3 text-h3 font-display">
              <StatusDot open={status.open} className="!size-3" />
              {status.head}
            </p>
            {status.tail && <p className="label mt-2 pl-6 text-muted-dark">{status.tail}</p>}
          </div>
          <address className="not-italic">
            <p className="label text-muted-dark">{t(COPY.visit.address)}</p>
            <p className="font-display mt-3 text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Magnetic>
                <a href={SITE.maps.google} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-ink transition-colors hover:bg-cream">
                  {t(COPY.visit.directions)} ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a href={SITE.maps.mapy} target="_blank" rel="noreferrer" className="label inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-3 transition-colors hover:bg-cream hover:text-ink">
                  {t(COPY.visit.mapy)} ↗
                </a>
              </Magnetic>
            </div>
          </address>
          <div>
            <p className="label text-muted-dark">{t(COPY.visit.contact)}</p>
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="font-display link-underline mt-3 inline-block text-[1.5rem]">
              {SITE.phone}
            </a>
          </div>
        </div>

        {/* Hours as a day timeline, with a live needle at the current Prague time */}
        <div className="lg:col-span-4">
          <div className="flex items-baseline justify-between">
            <p className="label text-muted-dark">{t(COPY.visit.hours)}</p>
            <p className="label tabular text-ember">
              {lang === "cs" ? "teď" : "now"} {String(clock.hour).padStart(2, "0")}:{String(clock.minute).padStart(2, "0")}
            </p>
          </div>
          <div aria-hidden className="mt-4 grid grid-cols-[7.5rem_1fr_6.5rem]">
            <span />
            <span className="relative h-5">
              {[6, 9, 12, 15, 18, 21].map((h) => (
                <span key={h} className="label tabular absolute top-0 -translate-x-1/2 text-[0.6rem] text-cream/50" style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${(h * 60 - SCALE_FROM) / SCALE_SPAN})` }}>
                  {h}
                </span>
              ))}
            </span>
            <span />
          </div>
          <table className="w-full border-collapse">
            <caption className="sr-only">{t(COPY.visit.hours)}</caption>
            <tbody>
              {SITE.hours.map((h, i) => {
                const isToday = i === today
                const from = h ? (toMinutes(h.open) - SCALE_FROM) / SCALE_SPAN : 0
                const to = h ? (toMinutes(h.close) - SCALE_FROM) / SCALE_SPAN : 0
                return (
                  <tr key={i} className={isToday ? "text-cream" : "text-cream/70"} aria-current={isToday ? "date" : undefined}>
                    <th scope="row" className="w-[7.5rem] py-3 pr-2 text-left font-normal">
                      <span className="flex items-center gap-2">
                        <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${isToday ? "bg-ember" : "bg-transparent"}`} />
                        {days[i]}
                      </span>
                    </th>
                    <td aria-hidden className="relative w-full px-3">
                      <span className="relative block h-[7px] rounded-full bg-cream/10">
                        {h && (
                          <span
                            className={`absolute inset-y-0 rounded-full ${isToday ? "bg-ember" : "bg-cream/45"}`}
                            style={{ left: `${from * 100}%`, width: `${(to - from) * 100}%` }}
                          />
                        )}
                      </span>
                      {nowPos !== null && (
                        <span className="absolute -bottom-px -top-px w-px bg-ember/80" style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${nowPos})` }} />
                      )}
                    </td>
                    <td className="tabular w-[6.5rem] whitespace-nowrap py-3 text-right font-mono text-[0.82rem]">
                      {h ? `${prettyTime(h.open)}–${prettyTime(h.close)}` : t(COPY.visit.closedDay)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Map */}
        <div className="lg:col-span-4">
          <MapCard />
        </div>
      </div>

      {/* Instagram */}
      <div className="relative mt-[clamp(5rem,10vw,9rem)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-h3">{t(COPY.visit.instaHeading)}</h3>
          <a href={SITE.instagram.url} target="_blank" rel="noreferrer" className="label link-underline text-ember">
            {SITE.instagram.handle} ↗
          </a>
        </div>
        <ul data-insta className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {INSTAGRAM_TILES.map((tile) => (
            <li key={tile.image}>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noreferrer"
                data-cursor={t(COPY.visit.instaCursor)}
                className="group relative block aspect-square overflow-hidden rounded-[14px]"
                aria-label={`Instagram: ${t(tile.alt)}`}
              >
                <Photo name={tile.image} alt="" sizes="(min-width: 768px) 16vw, 32vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
                <span aria-hidden className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* The last line */}
      <div className="relative py-[clamp(6rem,14vw,12rem)] text-center">
        <p data-final className="font-display mx-auto max-w-[14ch] text-[clamp(3.4rem,10.5vw,11rem)] leading-[0.9] tracking-[-0.045em]">
          <span className="sr-only">{t(COPY.visit.final)}</span>
          {finalWords.map((w, wi) => (
            <span key={wi} aria-hidden className="line-mask mr-[0.22em] inline-block last:mr-0">
              {[...w].map((c, ci) => (
                <span key={ci} className={`char inline-block ${wi >= finalWords.length - 2 ? 'font-display-italic text-ember' : ''}`}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.4}>
            <a
              href={SITE.maps.google}
              target="_blank"
              rel="noreferrer"
              data-cursor={t(COPY.visit.directions)}
              className="label grid size-[clamp(120px,12vw,160px)] place-items-center rounded-full bg-cream text-ink transition-colors duration-500 hover:bg-ember"
            >
              {t(COPY.visit.directions)} ↗
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
