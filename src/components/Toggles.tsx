import { COPY } from '../content/copy'
import { useLang } from '../content/i18n'
import { cafeAudio, useSoundEnabled } from '../lib/audio'

export function SoundToggle() {
  const { t } = useLang()
  const on = useSoundEnabled()
  return (
    <button
      type="button"
      onClick={() => void cafeAudio.toggle()}
      aria-pressed={on}
      aria-label={t(on ? COPY.nav.soundOff : COPY.nav.soundOn)}
      title={t(COPY.nav.sound)}
      className="group flex h-9 items-center gap-2 rounded-full border border-current/25 px-3 transition-colors hover:bg-current/10"
    >
      <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
        {[0.55, 1, 0.7, 0.9].map((h, i) => (
          <span
            key={i}
            className={`w-[2px] origin-bottom rounded-full bg-current ${on ? 'sound-bar' : ''}`}
            style={{ height: '100%', transform: `scaleY(${on ? h : 0.25})`, animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </span>
      <span className="label hidden sm:inline">{t(COPY.nav.sound)}</span>
    </button>
  )
}

export function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
      title={t(COPY.nav.lang)}
      className="label flex h-9 items-center gap-1 rounded-full border border-current/25 px-3 transition-colors hover:bg-current/10"
    >
      <span className={lang === 'cs' ? 'opacity-100' : 'opacity-40'}>CS</span>
      <span aria-hidden className="opacity-40">/</span>
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
      <span className="sr-only">{t(COPY.nav.lang)}</span>
    </button>
  )
}
