import { useRef, useState, type CSSProperties } from 'react'
import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { MENU, PROFILE_AXES, type Category, type MenuItem } from '../content/menu'
import { Flip, gsap } from '../lib/gsap'
import { prefersReducedMotion, useIsoLayoutEffect } from '../lib/motion'
import { useSectionTheme } from '../lib/theme'
import { Photo } from '../components/Photo'
import { RevealLines } from '../components/RevealLines'

type Filter = 'all' | Category
const FILTERS: Filter[] = ['all', 'coffee', 'pastry', 'seasonal']

const TILE: Record<Category, string> = {
  coffee: 'bg-flour',
  pastry: 'bg-[#F1E4CF]',
  seasonal: 'bg-[#E7E3CC]',
}
const DOT: Record<Category, string> = {
  coffee: 'bg-crust',
  pastry: 'bg-caramel',
  seasonal: 'bg-bean',
}

function MenuTile({ item, open, onToggle }: { item: MenuItem; open: boolean; onToggle: () => void }) {
  const { t } = useLang()
  const axes = PROFILE_AXES[item.category]
  const panelId = `menu-${item.id}`
  const photo = Boolean(item.image)
  return (
    <article
      data-open={open}
      className={`group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-[22px] border p-5 sm:min-h-[clamp(240px,23vw,300px)] sm:p-6 ${
        photo ? "border-transparent bg-ink text-cream" : `border-ink/10 text-ink ${TILE[item.category]}`
      }`}
    >
      {photo && (
        <>
          <Photo
            name={item.image!}
            alt=""
            sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
            className="absolute inset-0"
            imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,16,12,0.6)_0%,rgba(21,16,12,0.08)_42%,rgba(21,16,12,0.82)_100%)]" />
        </>
      )}
      <div className="relative flex items-start justify-between gap-4">
        <p className={`label flex items-center gap-2 ${photo ? "text-cream/85" : "text-muted-light"}`}>
          <span aria-hidden className={`size-1.5 rounded-full ${DOT[item.category]}`} />
          {t(COPY.menu.filters[item.category])}
          {item.size && <span className="normal-case tracking-normal opacity-80">· {t(item.size)}</span>}
        </p>
      </div>

      <h3 className="font-display relative mt-auto pt-5 text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[0.95] sm:pt-8">{t(item.name)}</h3>
      <div className="relative mt-4 flex items-end justify-between">
        <p className={`font-display tabular text-[1.7rem] leading-none ${photo ? "text-[#f6d9b8]" : "text-crust"}`}>
          {item.price}
          <span className="label ml-1.5 align-middle">{t(COPY.menu.currency)}</span>
        </p>
        <span
          aria-hidden
          className={`grid size-9 place-items-center rounded-full border transition-transform duration-500 group-hover:rotate-45 group-data-[open=true]:rotate-45 ${photo ? 'border-cream/40' : 'border-ink/25'}`}
        >
          <svg viewBox="0 0 12 12" className="size-3">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </div>

      {/* Whole tile is the toggle (keyboard + touch); hover reveals too on desktop */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t(item.name)}, ${item.price} ${t(COPY.menu.currency)}. ${t(COPY.menu.details)}`}
        data-cursor={t(COPY.pastry.cursor)}
        className="absolute inset-0 z-[1] rounded-[22px]"
      />

      <div
        id={panelId}
        className="pointer-events-none absolute inset-0 z-[2] flex translate-y-[102%] flex-col bg-ink p-6 text-cream transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-focus-within:translate-y-0 group-data-[open=true]:translate-y-0"
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-[1.6rem] leading-none">{t(item.name)}</p>
          <p className="font-display tabular text-[1.6rem] leading-none text-ember">{item.price}</p>
        </div>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-cream/80">{t(item.note)}</p>
        <div className="mt-auto pt-5">
          <p className="label mb-3 text-muted-dark">{t(COPY.menu.profile)}</p>
          <dl className="space-y-2.5">
            {axes.map((axis, i) => (
              <div key={i} className="grid grid-cols-[6.5rem_1fr_1.2rem] items-center gap-3">
                <dt className="label text-cream/75">{t(axis)}</dt>
                <dd className="relative h-[3px] overflow-hidden rounded-full bg-cream/15">
                  <span
                    className="absolute inset-0 origin-left scale-x-0 rounded-full bg-ember transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:[transform:scaleX(var(--v))] group-focus-within:[transform:scaleX(var(--v))] group-data-[open=true]:[transform:scaleX(var(--v))]"
                    style={{ '--v': item.profile[i] / 5, transitionDelay: `${150 + i * 90}ms` } as CSSProperties}
                  />
                </dd>
                <dd className="label tabular text-right text-cream/60">{item.profile[i]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  )
}

export function Menu() {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLUListElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  useSectionTheme(root, 'menu')

  const change = (f: Filter) => {
    if (f === filter) return
    if (!prefersReducedMotion()) flipState.current = Flip.getState(grid.current!.querySelectorAll('[data-item]'))
    setOpenId(null)
    setFilter(f)
  }

  // FLIP: measure before the filter changes, animate from there after React re-renders.
  useIsoLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null
    Flip.from(state, {
      targets: grid.current!.querySelectorAll('[data-item]'),
      duration: 0.8,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.25, ease: 'expo.out' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.88, duration: 0.35, ease: 'power2.in' }),
    })
  }, [filter])

  const count = (f: Filter) => (f === 'all' ? MENU.length : MENU.filter((i) => i.category === f).length)

  return (
    <section ref={root} id="menu" aria-labelledby="menu-heading" className="sec relative px-gutter py-section text-ink [--sec-bg:#f6efe4]">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label text-crust">{t(COPY.menu.label)}</p>
          <RevealLines as="h2" id="menu-heading" className="font-display mt-6 text-h2 leading-[0.92]">
            {t(COPY.menu.heading)}
          </RevealLines>
        </div>
        <div className="lg:col-span-5 lg:justify-self-end">
          <div role="group" aria-label={t(COPY.menu.filterLabel)} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = f === filter
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => change(f)}
                  className={`label flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors duration-300 ${
                    on ? 'border-ink bg-ink text-cream' : 'border-ink/25 hover:border-ink'
                  }`}
                >
                  {t(COPY.menu.filters[f])}
                  <sup className="tabular text-[0.6rem] opacity-60">{count(f)}</sup>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <ul ref={grid} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MENU.map((item) => {
          const visible = filter === 'all' || item.category === filter
          return (
            <li key={item.id} data-item data-flip-id={item.id} className={visible ? '' : 'hidden'}>
              <MenuTile item={item} open={openId === item.id} onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))} />
            </li>
          )
        })}
      </ul>

      <p className="label mt-8 text-muted-light">{t(COPY.menu.note)}</p>
    </section>
  )
}
