import { SITE, type DayHours } from '../content/site'

export type PragueClock = {
  /** 0 = Monday … 6 = Sunday */
  dow: number
  /** seconds since local midnight in Prague */
  seconds: number
  hour: number
  minute: number
  ymd: string
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: SITE.timezone,
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

/** Wall-clock time in Prague, whatever the visitor's own timezone is. */
export function pragueClock(date = new Date()): PragueClock {
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  const hour = Number(parts.hour) % 24
  const minute = Number(parts.minute)
  const second = Number(parts.second)
  return {
    dow: WEEKDAYS.indexOf(parts.weekday),
    hour,
    minute,
    seconds: hour * 3600 + minute * 60 + second,
    ymd: `${parts.year}-${parts.month}-${parts.day}`,
  }
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Display a time as 7:30 (strip leading zero). */
export const prettyTime = (hhmm: string) => hhmm.replace(/^0/, '')

function addDays(ymd: string, days: number) {
  const d = new Date(`${ymd}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function hoursFor(ymd: string, dow: number): DayHours {
  const special = (SITE.specialDays as Record<string, DayHours>)[ymd]
  if (special !== undefined) return special
  return SITE.hours[dow] ?? null
}

export type OpenStatus =
  | { open: true; closes: string; minutesLeft: number }
  | { open: false; opens: string; inDays: number; dow: number }
  | { open: false; opens: null; inDays: -1; dow: -1 }

export function openStatus(date = new Date()): OpenStatus {
  const now = pragueClock(date)
  const nowMin = Math.floor(now.seconds / 60)
  const today = hoursFor(now.ymd, now.dow)

  if (today) {
    const o = toMinutes(today.open)
    const c = toMinutes(today.close)
    if (nowMin >= o && nowMin < c) return { open: true, closes: today.close, minutesLeft: c - nowMin }
    if (nowMin < o) return { open: false, opens: today.open, inDays: 0, dow: now.dow }
  }
  for (let i = 1; i <= 14; i++) {
    const dow = (now.dow + i) % 7
    const h = hoursFor(addDays(now.ymd, i), dow)
    if (h) return { open: false, opens: h.open, inDays: i, dow }
  }
  return { open: false, opens: null, inDays: -1, dow: -1 }
}

export type BakeState = { fresh: boolean; secondsToNext: number }

/** Countdown to the next tray (daily at SITE.bake.time, Prague time). */
export function bakeState(date = new Date()): BakeState {
  const now = pragueClock(date)
  const bake = toMinutes(SITE.bake.time) * 60
  const since = now.seconds - bake
  const fresh = since >= 0 && since < SITE.bake.freshForMinutes * 60
  const secondsToNext = (bake - now.seconds + 86400) % 86400 || 86400
  return { fresh, secondsToNext }
}

export function greetingKey(date = new Date()): 'morning' | 'forenoon' | 'afternoon' | 'evening' {
  const { hour } = pragueClock(date)
  if (hour >= 4 && hour < 10) return 'morning'
  if (hour >= 10 && hour < 12) return 'forenoon'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}
