import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { SITE } from '../content/site'
import { prettyTime } from '../lib/hours'
import { scrollToTarget } from '../lib/smooth'
import { LogoMark } from '../components/Logo'
import { Magnetic } from '../components/Magnetic'

export function Footer() {
  const { t, lang } = useLang()
  const days = COPY.days[lang]
  const wk = SITE.hours[0]
  const sat = SITE.hours[5]
  const sun = SITE.hours[6]
  return (
    <footer className="sec-solid relative overflow-hidden px-gutter pb-8 pt-16 text-cream [--logo-cut:#15100c] [--sec-bg:#100b08]">
      <div className="grid gap-10 border-t border-cream/12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoMark className="size-12" />
          <p className="mt-5 max-w-[22rem] text-cream/70">{t(COPY.footer.tagline)}</p>
        </div>
        <address className="not-italic">
          <p className="label text-muted-dark">{t(COPY.visit.address)}</p>
          <p className="mt-3 leading-relaxed">
            {SITE.address.street}
            <br />
            {SITE.address.zip} {SITE.address.city}
            <br />
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="link-underline">
              {SITE.phone}
            </a>
          </p>
        </address>
        <div>
          <p className="label text-muted-dark">{t(COPY.visit.hours)}</p>
          <p className="tabular mt-3 leading-relaxed">
            {days[0].slice(0, 2)}–{days[4].slice(0, 2)} {wk && `${prettyTime(wk.open)}–${prettyTime(wk.close)}`}
            <br />
            {days[5]} {sat && `${prettyTime(sat.open)}–${prettyTime(sat.close)}`}
            <br />
            {days[6]} {sun && `${prettyTime(sun.open)}–${prettyTime(sun.close)}`}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <p className="label text-muted-dark">Social</p>
          <a href={SITE.instagram.url} target="_blank" rel="noreferrer" className="link-underline">
            Instagram {SITE.instagram.handle}
          </a>
          <Magnetic>
            <button type="button" onClick={() => scrollToTarget(0)} className="label mt-4 rounded-full border border-cream/25 px-4 py-2.5 transition-colors hover:bg-cream hover:text-ink">
              ↑ {t(COPY.footer.top)}
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Decorative wordmark drawn as SVG so it reads as an image, not low-contrast text */}
      <svg aria-hidden viewBox="0 0 1000 170" className="pointer-events-none mt-16 w-full select-none">
        <text x="500" y="140" textAnchor="middle" fill="#F3EADC" fillOpacity="0.07" style={{ fontFamily: "var(--font-serif)", fontVariationSettings: "\"SOFT\" 100", fontWeight: 380, letterSpacing: "-0.05em" }} fontSize="182">
          Coffee <tspan fontStyle="italic" fontWeight="330">Bubble</tspan>
        </text>
      </svg>

      <div className="label mt-6 flex flex-wrap justify-between gap-4 text-cream/65">
        <p>© {new Date().getFullYear()} {SITE.legalName}</p>
        <p>{t(COPY.footer.photos)}</p>
      </div>
    </footer>
  )
}
