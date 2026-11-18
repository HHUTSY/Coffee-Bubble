import { useRef, type ElementType } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import { isTranslated, onTranslate, useIsoLayoutEffect, useReducedMotion } from '../lib/motion'

type Props = {
  children: string
  as?: ElementType
  className?: string
  id?: string
  delay?: number
  stagger?: number
  start?: string
}

/** Text that rises into view line by line, each line in its own mask. */
export function RevealLines({ children, as: Tag = 'p', className = '', id, delay = 0, stagger = 0.085, start = 'top 86%' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {})
    if (reduced) {
      ctx.add(() => {
        gsap.from(el, { opacity: 0, duration: 0.6, ease: 'power1.out', scrollTrigger: { trigger: el, start, once: true } })
      })
      return () => ctx.revert()
    }
    // A page translated by the browser (Google Translate etc.) rewrites the text nodes;
    // splitting it again would fight the translator and make the lines jump. Show plain text.
    if (isTranslated()) return () => ctx.revert()
    el.style.visibility = 'hidden'
    let alive = true
    let split: SplitText | null = null
    const unwatch = onTranslate(() => {
      split?.revert()
      split = null
      el.style.visibility = ''
    })
    document.fonts.ready.then(() => {
      if (!alive) return
      ctx.add(() => {
        split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            el.style.visibility = ''
            // give descenders (ý, g, j) room inside each line mask
            self.masks.forEach((m) => {
              const s = (m as HTMLElement).style
              s.paddingBottom = '0.14em'
              s.marginBottom = '-0.14em'
            })
            return gsap.from(self.lines, {
              yPercent: 112,
              rotate: 1.5,
              transformOrigin: '0% 0%',
              duration: 1.25,
              ease: 'expo.out',
              stagger,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
              // once the lines have landed, give the plain text back (stable for translators, resizes, find-in-page)
              onComplete: () => {
                split?.revert()
                split = null
              },
            })
          },
        })
      })
    })
    return () => {
      alive = false
      unwatch()
      el.style.visibility = ''
      ctx.revert()
    }
  }, [children, reduced])

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  )
}
