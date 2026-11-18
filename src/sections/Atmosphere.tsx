import { useEffect, useRef, useState } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { GALLERY, type GalleryImage } from '../content/stories'
import { gsap } from '../lib/gsap'
import { useIsoLayoutEffect, useMedia } from '../lib/motion'
import { lockScroll } from '../lib/smooth'
import { useSectionTheme } from '../lib/theme'
import { Photo } from '../components/Photo'
import { RevealLines } from '../components/RevealLines'

/**
 * "A place where time stops for a while": the headline literally stops (sticky)
 * while the photos drift past over it, each column at its own speed.
 */
export function Atmosphere() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const wide = useMedia('(min-width: 768px)')
  const [zoom, setZoom] = useState<GalleryImage | null>(null)
  useSectionTheme(root, 'caramel')

  const columns: GalleryImage[][] = wide
    ? GALLERY
    : (() => {
        const flat = GALLERY.flat()
        return [flat.filter((_, i) => i % 2 === 0), flat.filter((_, i) => i % 2 === 1)]
      })()

  useIsoLayoutEffect(() => {
    const el = root.current!
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(el)
      const speeds = wide ? [-12, 10, -20] : [-6, 8]
      q('[data-col]').forEach((col, i) => {
        gsap.fromTo(
          col,
          { yPercent: -speeds[i] },
          { yPercent: speeds[i], ease: 'none', scrollTrigger: { trigger: '[data-masonry]', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      q('[data-tile]').forEach((tile) => {
        const img = tile.querySelector('img')
        gsap.fromTo(img, { scale: 1.22 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from(tile, { yPercent: 16, rotate: gsap.utils.random(-3, 3), opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: tile, start: 'top 96%', once: true } })
      })
      // the still headline breathes very slightly while the world moves past
      gsap.fromTo(q('[data-still]'), { scale: 0.96 }, { scale: 1.04, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, el)
    return () => mm.revert()
  }, [wide, lang])

  let n = 0
  return (
    <section
      ref={root}
      id="atmosphere"
      aria-labelledby="atmosphere-heading"
      className="sec relative isolate overflow-clip px-gutter pb-section text-ink [--sec-bg:#c98a4b]"
    >
      {/* The headline that stands still */}
      <div className="pointer-events-none sticky top-0 z-0 flex h-[100svh] flex-col items-center justify-center text-center">
        <div data-still className="flex flex-col items-center will-change-transform">
          <p className="label text-ink/70">{t(COPY.atmosphere.label)}</p>
          <RevealLines as="h2" id="atmosphere-heading" className="font-display mt-6 max-w-[13ch] text-[clamp(3.1rem,9vw,9.6rem)] leading-[0.88]">
            {t(COPY.atmosphere.heading)}
          </RevealLines>
          <p className="text-lead mt-8 max-w-[32rem] text-ink/80">{t(COPY.atmosphere.sub)}</p>
        </div>
      </div>

      {/* Photos drifting over it */}
      <div
        data-masonry
        className={`relative z-10 -mt-[18svh] grid gap-3 md:-mt-[10svh] md:gap-6 ${wide ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        {columns.map((col, ci) => (
          <div
            key={ci}
            data-col
            className={`flex flex-col gap-3 will-change-transform md:gap-6 ${wide ? (ci === 1 ? 'pt-[38vh]' : ci === 2 ? 'pt-[14vh]' : '') : ci === 1 ? 'pt-[22vh]' : ''} ${wide && ci !== 1 ? 'md:px-[1.5vw]' : ''}`}
          >
            {col.map((img) => {
              const idx = ++n
              return (
                <figure key={img.image} data-tile className={`group relative ${wide && idx % 3 === 0 ? 'md:mx-[8%]' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setZoom(img)}
                    data-cursor={t(COPY.atmosphere.cursor)}
                    className="relative block w-full overflow-hidden rounded-[clamp(14px,1.6vw,24px)] shadow-[0_40px_80px_-40px_rgba(21,16,12,0.55)]"
                    style={{ aspectRatio: img.ratio }}
                    aria-label={t(img.alt)}
                  >
                    <Photo name={img.image} alt={t(img.alt)} sizes={wide ? '32vw' : '48vw'} className="absolute inset-0" imgClassName="will-change-transform" />
                  </button>
                  <figcaption className="label mt-2 text-ink/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Fig. {String(idx).padStart(2, '0')}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        ))}
      </div>

      {zoom && <Lightbox image={zoom} onClose={() => setZoom(null)} />}
    </section>
  )
}

function Lightbox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  const { t, lang } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus()
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    gsap.fromTo(ref.current!.querySelector('picture'), { scale: 0.94, y: 20 }, { scale: 1, y: 0, duration: 0.8, ease: 'expo.out' })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      prev?.focus({ preventScroll: true })
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t(image.alt)}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 bg-ink/92 p-[var(--gutter)] backdrop-blur-sm"
      onClick={onClose}
    >
      <Photo
        name={image.image}
        alt={t(image.alt)}
        sizes="90vw"
        className="max-h-[80svh] w-auto overflow-hidden rounded-2xl bg-transparent"
        imgClassName="max-h-[80svh] w-auto !h-auto object-contain"
      />
      <p className="label max-w-xl text-center text-cream/75">{t(image.alt)}</p>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="label absolute right-[var(--gutter)] top-[var(--gutter)] rounded-full border border-cream/30 px-4 py-2 text-cream hover:bg-cream hover:text-ink"
      >
        {lang === 'cs' ? 'Zavřít' : 'Close'} ✕
      </button>
    </div>
  )
}
