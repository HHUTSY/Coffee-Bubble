import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { THEMES, getTheme, onThemeChange, type ThemeKey } from '../lib/theme'
import { prefersReducedMotion } from '../lib/motion'

const KEYS = Object.keys(THEMES) as ThemeKey[]

/** Fixed full-screen colour layers. Only opacity changes, so the cross-fade stays on the compositor. */
export function ThemeBackdrop() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layers = root.current!.querySelectorAll<HTMLElement>('[data-layer]')
    const show = (key: ThemeKey) => {
      layers.forEach((layer) => {
        gsap.to(layer, {
          opacity: layer.dataset.layer === key ? 1 : 0,
          duration: prefersReducedMotion() ? 0.2 : 0.9,
          ease: 'power2.inOut',
          overwrite: true,
        })
      })
    }
    document.documentElement.dataset.tone = THEMES[getTheme()].tone
    return onThemeChange(show)
  }, [])

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {KEYS.map((key) => (
        <div
          key={key}
          data-layer={key}
          className="absolute inset-0 will-change-[opacity]"
          style={{ background: THEMES[key].bg, opacity: key === getTheme() ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
