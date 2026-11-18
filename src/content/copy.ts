/**
 * ─────────────────────────────────────────────────────────────
 *  TEXTY WEBU (CZ / EN)  ·  усі тексти сторінки в одному місці
 * ─────────────────────────────────────────────────────────────
 *  Kus textu ve složených závorkách {img:…} je malá fotka uvnitř věty (manifest).
 */
import type { L } from './i18n'

export const COPY = {
  meta: {
    skip: { cs: 'Přeskočit na obsah', en: 'Skip to content' },
  },

  nav: {
    menu: { cs: 'Menu', en: 'Menu' },
    pastry: { cs: 'Z pece', en: 'Oven' },
    atmosphere: { cs: 'Atmosféra', en: 'Atmosphere' },
    visit: { cs: 'Návštěva', en: 'Visit' },
    open: { cs: 'Otevřít navigaci', en: 'Open navigation' },
    close: { cs: 'Zavřít navigaci', en: 'Close navigation' },
    home: { cs: 'Coffee Bubble — na začátek stránky', en: 'Coffee Bubble — back to top' },
    sound: { cs: 'Zvuk kavárny', en: 'Café sound' },
    soundOn: { cs: 'Zapnout zvuk kavárny', en: 'Turn café sound on' },
    soundOff: { cs: 'Vypnout zvuk kavárny', en: 'Turn café sound off' },
    lang: { cs: 'Switch to English', en: 'Přepnout do češtiny' },
  },

  status: {
    open: { cs: 'Otevřeno', en: 'Open' },
    closed: { cs: 'Zavřeno', en: 'Closed' },
    closingSoon: { cs: 'Brzy zavíráme', en: 'Closing soon' },
    until: { cs: 'do {t}', en: 'until {t}' },
    opensToday: { cs: 'otevíráme v {t}', en: 'opens at {t}' },
    opensTomorrow: { cs: 'otevíráme zítra v {t}', en: 'opens tomorrow at {t}' },
    opensOn: { cs: 'otevíráme {day} v {t}', en: 'opens {day} at {t}' },
  },

  days: {
    cs: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    /** „otevíráme v pondělí“ */
    onCs: ['v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu', 'v neděli'],
    onEn: ['on Monday', 'on Tuesday', 'on Wednesday', 'on Thursday', 'on Friday', 'on Saturday', 'on Sunday'],
  },

  greeting: {
    morning: { cs: 'Dobré ráno', en: 'Good morning' },
    forenoon: { cs: 'Dobré dopoledne', en: 'Good morning' },
    afternoon: { cs: 'Dobré odpoledne', en: 'Good afternoon' },
    evening: { cs: 'Dobrý večer', en: 'Good evening' },
  },

  preloader: { cs: 'Vaříme první kávu', en: 'Brewing the first coffee' },

  hero: {
    title: { cs: 'Coffee Bubble — kavárna a pekárna v Chomutově', en: 'Coffee Bubble — café and bakery in Chomutov' },
    kicker: { cs: 'Kavárna & pekárna', en: 'Café & bakery' },
    lead: {
      cs: 'Specialty káva a pečivo, které každé ráno vytahujeme z pece. Na Žižkově náměstí v Chomutově.',
      en: 'Specialty coffee and pastry pulled from our oven every morning. On Žižkovo Square in Chomutov.',
    },
    scroll: { cs: 'Scrollujte, den začíná', en: 'Scroll, the day begins' },
    photoAlt: {
      cs: 'Cappuccino s latte artem na dřevěném pultu kavárny Coffee Bubble',
      en: 'Cappuccino with latte art on the wooden counter at Coffee Bubble',
    },
  },

  manifesto: {
    label: { cs: '(01) Kdo jsme', en: '(01) Who we are' },
    /** Věta s vloženými fotkami: {img:pastry} {img:coffee} {img:candle} */
    text: {
      cs: 'Jsme malá kavárna na Žižkově náměstí. Každé ráno vytahujeme z pece {img:pastry} koláče, šneky a croissanty, vaříme kávu, na které si dáváme záležet, {img:coffee} a necháváme čas běžet o něco pomaleji. {img:candle}',
      en: 'We’re a small café on Žižkovo Square. Every morning we pull koláče, cinnamon rolls and croissants from the oven, {img:pastry} brew coffee we genuinely care about {img:coffee} and let time run a little slower. {img:candle}',
    },
    facts: [
      { value: { cs: '4,4', en: '4.4' }, label: { cs: 'hodnocení na Googlu · 486 recenzí', en: 'Google rating · 486 reviews' } },
      { value: { cs: '7:00', en: '7:00' }, label: { cs: 'první plech jde z pece', en: 'first tray out of the oven' } },
      { value: { cs: '19:00', en: '19:00' }, label: { cs: 'zhasínáme svíčky', en: 'we blow out the candles' } },
    ],
    badge: 'Coffee Bubble • Foodie Bubble • Chomutov • ',
  },

  process: {
    label: { cs: '(02) Od zrna k šálku', en: '(02) From bean to cup' },
    heading: { cs: 'Pět kroků. Jeden šálek.', en: 'Five steps. One cup.' },
    goTo: { cs: 'Přejít na krok', en: 'Go to step' },
  },

  pastry: {
    label: { cs: '(03) Z naší pece', en: '(03) From our oven' },
    heading: { cs: 'Pečeme každé ráno. Když dojde, dojde.', en: 'Baked every morning. When it’s gone, it’s gone.' },
    sub: {
      cs: 'Kynuté těsto, poctivé náplně, pořádné máslo a žádné zkratky. Co ráno najdete ve vitríně, ještě před pár hodinami kynulo.',
      en: 'Yeasted dough, honest fillings, real butter and no shortcuts. What you find in the case this morning was still rising a few hours ago.',
    },
    cursor: { cs: 'Ochutnat', en: 'Taste' },
    drag: { cs: 'Scrollujte dál', en: 'Keep scrolling' },
    swipe: { cs: 'Přejeďte prstem', en: 'Swipe' },
    oven: {
      label: { cs: 'Pec · živě', en: 'Oven · live' },
      title: { cs: 'Každé ráno v 7:00 z pece.', en: 'Out of the oven every morning at 7:00.' },
      next: { cs: 'Další plech za', en: 'Next tray in' },
      fresh: { cs: 'Právě z pece. Ještě teplé.', en: 'Just out of the oven. Still warm.' },
      units: { cs: ['hod', 'min', 's'], en: ['h', 'min', 's'] },
      items: { cs: 'Croissanty · Skořicoví šneci · Koláče · Choux', en: 'Croissants · Cinnamon rolls · Koláče · Choux' },
      note: { cs: 'Tip: přijďte brzy. Šneci mizí jako první.', en: 'Tip: come early. The cinnamon rolls go first.' },
    },
  },

  menu: {
    label: { cs: '(04) Menu', en: '(04) Menu' },
    heading: { cs: 'Co dnes vaříme a pečeme', en: 'What we’re brewing and baking' },
    filters: {
      all: { cs: 'Vše', en: 'All' },
      coffee: { cs: 'Káva', en: 'Coffee' },
      pastry: { cs: 'Pečivo', en: 'Pastry' },
      seasonal: { cs: 'Sezónní', en: 'Seasonal' },
    },
    filterLabel: { cs: 'Filtrovat menu', en: 'Filter the menu' },
    profile: { cs: 'Chuťový profil', en: 'Taste profile' },
    details: { cs: 'Zobrazit detail', en: 'Show details' },
    note: {
      cs: 'Ceny jsou v Kč. Na alergeny se zeptejte u baru, rádi poradíme.',
      en: 'Prices in CZK. Ask at the bar about allergens, we’re happy to help.',
    },
    currency: { cs: 'Kč', en: 'CZK' },
  },

  atmosphere: {
    label: { cs: '(05) Atmosféra', en: '(05) Atmosphere' },
    heading: { cs: 'Místo, kde se na chvíli zastaví čas.', en: 'A place where time stops for a while.' },
    sub: {
      cs: 'Pohodlné sezení, poctivé občerstvení, milá obsluha a wifi zdarma. A svíčky, jakmile se setmí.',
      en: 'Comfy seats, honest food, friendly staff and free wifi. And candles, as soon as it gets dark.',
    },
    cursor: { cs: 'Dívat se', en: 'Look' },
  },

  reviews: {
    label: { cs: '(06) Recenze', en: '(06) Reviews' },
    heading: { cs: 'Co o nás říkáte', en: 'What you say about us' },
    ratingLabel: { cs: 'hodnocení na Googlu', en: 'rating on Google' },
    count: { cs: '{n} recenzí', en: '{n} reviews' },
    readAll: { cs: 'Přečíst recenze na Googlu', en: 'Read the reviews on Google' },
    prev: { cs: 'Předchozí recenze', en: 'Previous review' },
    next: { cs: 'Další recenze', en: 'Next review' },
    carousel: { cs: 'Recenze hostů', en: 'Guest reviews' },
  },

  visit: {
    label: { cs: '(07) Návštěva', en: '(07) Visit' },
    heading: { cs: 'Zastavte se. Máme otevřeno každý den.', en: 'Drop by. We’re open every day.' },
    address: { cs: 'Adresa', en: 'Address' },
    hours: { cs: 'Otevírací doba', en: 'Opening hours' },
    contact: { cs: 'Kontakt', en: 'Contact' },
    today: { cs: 'Dnes', en: 'Today' },
    closedDay: { cs: 'Zavřeno', en: 'Closed' },
    directions: { cs: 'Navigovat', en: 'Directions' },
    mapy: { cs: 'Mapy.cz', en: 'Mapy.cz' },
    showMap: { cs: 'Zobrazit mapu', en: 'Show map' },
    mapNote: { cs: 'Mapa se načte z OpenStreetMap až po kliknutí.', en: 'The map loads from OpenStreetMap only after you click.' },
    mapTitle: { cs: 'Mapa: Coffee Bubble, Žižkovo náměstí, Chomutov', en: 'Map: Coffee Bubble, Žižkovo Square, Chomutov' },
    instaHeading: { cs: 'Sledujte nás', en: 'Follow along' },
    instaCursor: { cs: 'Instagram', en: 'Instagram' },
    final: { cs: 'Káva je hotová. Chybíte jen vy.', en: 'The coffee’s ready. All we need is you.' },
  },

  footer: {
    tagline: {
      cs: 'Kavárna & pekárna na Žižkově náměstí v Chomutově.',
      en: 'Café & bakery on Žižkovo Square in Chomutov.',
    },
    top: { cs: 'Nahoru', en: 'Back to top' },
    photos: { cs: 'Fotografie: @coffee_bubble_cz', en: 'Photos: @coffee_bubble_cz' },
  },
} satisfies Record<string, unknown>

/** Replace `{key}` placeholders. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
}

export type { L }
