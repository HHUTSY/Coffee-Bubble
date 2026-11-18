import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer, useReducedMotion } from '../lib/motion'

const INTERACTIVE = '[data-cursor], a, button, [role="button"], summary, label, input, select, textarea'

/**
 * Small coffee bean that follows the pointer; over anything with `data-cursor="Text"`
 * it grows into an ember bubble with that text. Desktop + fine pointer only.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const enabled = fine && !reduced

  useEffect(() => {
    if (!enabled) return
    const el = ref.current!
    const root = document.documentElement
    root.classList.add('has-cursor')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3' })

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.remove('is-hidden')
    }
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE)
      if (!target) {
        el.classList.remove('is-active', 'is-link')
        return
      }
      const text = target.dataset.cursor
      if (text) {
        setLabel(text)
        el.classList.add('is-active')
        el.classList.remove('is-link')
      } else {
        el.classList.remove('is-active')
        el.classList.add('is-link')
      }
    }
    const hide = () => el.classList.add('is-hidden')
    const down = () => gsap.to(el, { scale: 0.82, duration: 0.15, ease: 'power2.out' })
    const up = () => gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    root.addEventListener('pointerleave', hide)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      root.removeEventListener('pointerleave', hide)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className="cursor is-hidden" aria-hidden>
      <span className="cursor__dot">
        {/* coffee bean: roasted body, cream outline (readable on light sections), centre crease */}
        <svg viewBox="0 0 24 32" width="100%" height="100%">
          <defs>
            <radialGradient id="cursor-bean" cx="38%" cy="30%" r="75%">
              <stop offset="0" stopColor="#b8703a" />
              <stop offset="0.55" stopColor="#7a3f19" />
              <stop offset="1" stopColor="#3d1f0e" />
            </radialGradient>
          </defs>
          <ellipse cx="12" cy="16" rx="10" ry="14" fill="url(#cursor-bean)" stroke="#f3eadc" strokeWidth="1.6" />
          <path d="M12.6 3.2C8.4 8 15.6 12.5 12 16s-3.6 8.6.6 12.8" fill="none" stroke="#2a150a" strokeWidth="1.9" strokeLinecap="round" />
          <ellipse cx="8" cy="10" rx="2" ry="3.6" fill="#f3eadc" opacity=".22" transform="rotate(20 8 10)" />
        </svg>
      </span>
      <span className="cursor__bubble">{label}</span>
    </div>
  )
}
