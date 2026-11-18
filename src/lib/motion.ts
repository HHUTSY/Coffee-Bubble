import { useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react'

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const REDUCED = '(prefers-reduced-motion: reduce)'
const FINE = '(hover: hover) and (pointer: fine)'

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', cb)
    return () => mql.removeEventListener('change', cb)
  }
}

export const prefersReducedMotion = () => window.matchMedia(REDUCED).matches
export const hasFinePointer = () => window.matchMedia(FINE).matches

export function useMedia(query: string) {
  const subscribe = useMemo(() => subscribeMedia(query), [query])
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMedia(REDUCED)
export const useFinePointer = () => useMedia(FINE)

/** Re-render every `ms` milliseconds; returns the current Date. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms)
    return () => window.clearInterval(id)
  }, [ms])
  return now
}

/* ── Intro signal: preloader → hero ───────────────────── */
let introDone = false
const introListeners = new Set<() => void>()

export function markIntroDone() {
  if (introDone) return
  introDone = true
  introListeners.forEach((fn) => fn())
}

/** Runs `fn` once the preloader has finished (immediately if it already has). */
export function onIntro(fn: () => void) {
  if (introDone) {
    fn()
    return () => {}
  }
  introListeners.add(fn)
  return () => {
    introListeners.delete(fn)
  }
}

export const isIntroDone = () => introDone
