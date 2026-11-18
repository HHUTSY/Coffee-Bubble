import { type RefObject } from 'react'
import { ScrollTrigger } from './gsap'
import { useIsoLayoutEffect } from './motion'

/**
 * The day cycle: every section names a moment of the day; a fixed backdrop
 * cross-fades between them (opacity only) as you scroll.
 */
export const THEMES = {
  night: { bg: '#15100C', tone: 'dark' },
  cream: { bg: '#F3EADC', tone: 'light' },
  dough: { bg: '#EADBC4', tone: 'light' },
  oven: { bg: '#1B110B', tone: 'dark' },
  menu: { bg: '#F6EFE4', tone: 'light' },
  caramel: { bg: '#C98A4B', tone: 'light' },
  latte: { bg: '#DCC6A8', tone: 'light' },
  evening: { bg: '#100B08', tone: 'dark' },
} as const

export type ThemeKey = keyof typeof THEMES
type Listener = (key: ThemeKey) => void

let current: ThemeKey = 'night'
const listeners = new Set<Listener>()

export function setTone(tone: 'light' | 'dark') {
  document.documentElement.dataset.tone = tone
}

/** Colour the nav scrim fades from (matches whatever is behind the nav). */
export function setScrim(color: string) {
  document.documentElement.style.setProperty('--theme-bg', color)
}

export function setTheme(key: ThemeKey) {
  if (key === current) return
  current = key
  setTone(THEMES[key].tone)
  setScrim(THEMES[key].bg)
  listeners.forEach((fn) => fn(key))
}

export const getTheme = () => current

export function onThemeChange(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** Switch the backdrop while the section crosses the middle of the viewport. */
export function useSectionTheme(ref: RefObject<HTMLElement | null>, key: ThemeKey) {
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) setTheme(key)
      },
    })
    return () => st.kill()
  }, [key])
}
