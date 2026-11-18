/**
 * ─────────────────────────────────────────────────────────────
 *  ZÁKLADNÍ ÚDAJE KAVÁRNY  ·  тут міняються адреса, години, контакти
 * ─────────────────────────────────────────────────────────────
 */

export type DayHours = { open: string; close: string } | null

export const SITE = {
  name: 'Coffee Bubble',
  legalName: 'Coffee Bubble & Foodie Bubble',

  address: {
    street: 'Žižkovo nám. 5762',
    zip: '430 01',
    city: 'Chomutov',
    country: { cs: 'Česko', en: 'Czechia' },
  },
  geo: { lat: 50.4608, lng: 13.4156974 },
  phone: '+420 704 444 747',

  instagram: {
    url: 'https://www.instagram.com/coffee_bubble_cz/',
    handle: '@coffee_bubble_cz',
  },
  maps: {
    google: 'https://www.google.com/maps/search/?api=1&query=Coffee%20Bubble%2C%20%C5%BDi%C5%BEkovo%20n%C3%A1m.%205762%2C%20Chomutov',
    mapy: 'https://mapy.cz/zakladni?q=Coffee%20Bubble%20Chomutov&x=13.4157&y=50.4608&z=18',
  },

  /** Hodnocení z Google Maps (stav k 17. 11. 2026) — aktualizujte čas od času. */
  rating: { value: 4.4, count: 486 },

  timezone: 'Europe/Prague',

  /** Otevírací doba. Index 0 = pondělí … 6 = neděle. `null` = zavřeno. */
  hours: [
    { open: '07:30', close: '19:00' },
    { open: '07:30', close: '19:00' },
    { open: '07:30', close: '19:00' },
    { open: '07:30', close: '19:00' },
    { open: '07:30', close: '19:00' },
    { open: '08:00', close: '19:00' },
    { open: '09:00', close: '19:00' },
  ] as DayHours[],

  /**
   * Výjimky (svátky, dovolená): 'RRRR-MM-DD' → hodiny nebo null (zavřeno).
   * Příklad: '2026-12-24': { open: '08:00', close: '12:00' }, '2026-12-25': null
   */
  specialDays: {} as Record<string, DayHours>,

  /** Kdy jde první plech z pece a jak dlouho je pečivo „ještě teplé“ (minuty). */
  bake: { time: '07:00', freshForMinutes: 120 },
} as const
