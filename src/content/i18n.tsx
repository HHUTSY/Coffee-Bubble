import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'cs' | 'en'
/** Text in both languages. */
export type L = { cs: string; en: string }

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Translate a bilingual value. */
  t: (value: L) => string
}

const LangContext = createContext<LangContextValue | null>(null)
const STORAGE_KEY = 'cb-lang'

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'cs' || v === 'en') return v
  } catch {
    /* private mode */
  }
  return 'cs'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title =
      lang === 'cs'
        ? 'Coffee Bubble — specialty káva a poctivé pečivo · Chomutov'
        : 'Coffee Bubble — specialty coffee & pastry baked every morning · Chomutov'
  }, [lang])

  const value = useMemo<LangContextValue>(() => ({ lang, setLang, t: (v) => v[lang] }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
