import { COPY, fill } from '../content/copy'
import { useLang } from '../content/i18n'
import { openStatus, prettyTime } from '../lib/hours'
import { useNow } from '../lib/motion'

/** Live "open / closed" status in Prague time. */
export function useOpenLabel() {
  const { t, lang } = useLang()
  const now = useNow(20_000)
  const s = openStatus(now)
  if (s.open) {
    const soon = s.minutesLeft <= 45
    return {
      open: true,
      head: t(soon ? COPY.status.closingSoon : COPY.status.open),
      tail: fill(t(COPY.status.until), { t: prettyTime(s.closes) }),
    }
  }
  if (s.opens === null) return { open: false, head: t(COPY.status.closed), tail: '' }
  const time = prettyTime(s.opens)
  const tail =
    s.inDays === 0
      ? fill(t(COPY.status.opensToday), { t: time })
      : s.inDays === 1
        ? fill(t(COPY.status.opensTomorrow), { t: time })
        : fill(t(COPY.status.opensOn), { t: time, day: (lang === 'cs' ? COPY.days.onCs : COPY.days.onEn)[s.dow] })
  return { open: false, head: t(COPY.status.closed), tail }
}

export function StatusDot({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <span aria-hidden className={`relative inline-flex size-2 shrink-0 ${className}`}>
      {open && <span className="absolute inset-0 animate-ping rounded-full bg-[#9fc27c] opacity-70" />}
      <span className={`relative inline-flex size-2 rounded-full ${open ? 'bg-[#9fc27c]' : 'bg-ember'}`} />
    </span>
  )
}

export function StatusPill({ compact = false }: { compact?: boolean }) {
  const { open, head, tail } = useOpenLabel()
  return (
    <p
      className="label flex items-center gap-2 rounded-full border border-current/25 px-3 py-2 whitespace-nowrap"
      aria-live="polite"
    >
      <StatusDot open={open} />
      <span>{head}</span>
      {tail && <span className={compact ? 'hidden xl:inline opacity-70' : 'opacity-70'}>· {tail}</span>}
    </p>
  )
}
