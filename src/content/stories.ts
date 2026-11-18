/**
 * ─────────────────────────────────────────────────────────────
 *  PŘÍBĚH „OD ZRNA K ŠÁLKU“, GALERIE ATMOSFÉRY, RECENZE, INSTAGRAM
 * ─────────────────────────────────────────────────────────────
 */
import type { L } from './i18n'

/* ── Od zrna k šálku ─────────────────────────────────── */
export type ProcessStage = {
  key: 'bean' | 'roast' | 'grind' | 'extract' | 'cup'
  title: L
  text: L
  spec: L
  /** barva pozadí scény */
  bg: string
  /** světlý nebo tmavý text */
  tone: 'light' | 'dark'
  /** volitelná fotka do „bubliny“ (jinak se kreslí generativní ilustrace) */
  image?: string
}

export const PROCESS: ProcessStage[] = [
  {
    key: 'bean',
    title: { cs: 'Zrno', en: 'The bean' },
    text: {
      cs: 'Všechno začíná u výběrové kávy. Zelené zrno voní spíš po hrachu a trávě, chuť se teprve rodí.',
      en: 'It all starts with specialty-grade coffee. Green beans smell more like peas and grass; the flavour is still waiting.',
    },
    spec: { cs: 'Výběrová káva · 80+ bodů SCA', en: 'Specialty grade · 80+ SCA points' },
    bg: '#56603F',
    tone: 'light',
  },
  {
    key: 'roast',
    title: { cs: 'Pražení', en: 'Roast' },
    text: {
      cs: 'Teplo probudí cukry a kyseliny. Pár vteřin rozhoduje mezi karamelem a hořkostí.',
      en: 'Heat wakes up sugars and acids. A few seconds decide between caramel and bitterness.',
    },
    spec: { cs: '≈ 200 °C · 10–12 minut', en: '≈ 200 °C · 10–12 minutes' },
    bg: '#5E3219',
    tone: 'light',
  },
  {
    key: 'grind',
    title: { cs: 'Mletí', en: 'Grind' },
    text: {
      cs: 'Meleme až těsně před přípravou. Namletá káva ztrácí vůni během pár minut.',
      en: 'We grind right before brewing. Ground coffee loses its aroma within minutes.',
    },
    spec: { cs: 'Espresso ≈ 250 µm · filtr ≈ 700 µm', en: 'Espresso ≈ 250 µm · filter ≈ 700 µm' },
    bg: '#24170F',
    tone: 'light',
  },
  {
    key: 'extract',
    title: { cs: 'Extrakce', en: 'Extraction' },
    text: {
      cs: '18 gramů kávy, 36 gramů nápoje, zhruba 28 vteřin. Barista hlídá čas, teplotu i chuť.',
      en: '18 grams in, 36 grams out, about 28 seconds. The barista watches time, temperature and taste.',
    },
    spec: { cs: '18 g → 36 g · 93 °C · 28 s', en: '18 g → 36 g · 93 °C · 28 s' },
    bg: '#B26F2E',
    tone: 'dark',
  },
  {
    key: 'cup',
    title: { cs: 'Šálek', en: 'The cup' },
    text: {
      cs: 'A pak už jen vy, šálek a chvíle, kdy se nikam nespěchá.',
      en: 'And then just you, a cup, and a moment with nowhere to be.',
    },
    spec: { cs: 'Každý den do 19:00', en: 'Every day until 19:00' },
    bg: '#F3EADC',
    tone: 'dark',
    image: 'process-cup',
  },
]

/* ── Galerie atmosféry (masonry) ─────────────────────── */
export type GalleryImage = { image: string; alt: L; ratio: string }

/** Tři sloupce; každý sloupec se při scrollu pohybuje jinou rychlostí. */
export const GALLERY: GalleryImage[][] = [
  [
    { image: 'drink-autumn-trio', ratio: '4 / 5', alt: { cs: 'Tři podzimní nápoje na stole se svíčkou a dýní', en: 'Three autumn drinks on a table with a candle and a pumpkin' } },
    { image: 'interior-window', ratio: '4 / 5', alt: { cs: 'Interiér: sezení u okna (místo pro fotku)', en: 'Interior: window seats (photo placeholder)' } },
    { image: 'counter-pastries', ratio: '9 / 16', alt: { cs: 'Croissanty a koláče ve vitríně s cedulkami', en: 'Croissants and koláče in the display case with chalk labels' } },
  ],
  [
    { image: 'atmosphere-candle', ratio: '3 / 4', alt: { cs: 'Latte při svíčce, v pozadí kávovar', en: 'Latte by candlelight, espresso machine behind' } },
    { image: 'interior-counter', ratio: '4 / 3', alt: { cs: 'Interiér: bar a vitrína (místo pro fotku)', en: 'Interior: bar and display (photo placeholder)' } },
    { image: 'drink-svarak', ratio: '3 / 4', alt: { cs: 'Cedulka se svařákem, dýně a sušené květiny', en: 'Mulled wine sign, pumpkin and dried flowers' } },
  ],
  [
    { image: 'manifesto-latte', ratio: '4 / 5', alt: { cs: 'Cappuccino vedle váze s kávovými zrny a svíčky', en: 'Cappuccino beside a vase of coffee beans and a candle' } },
    { image: 'interior-detail', ratio: '1 / 1', alt: { cs: 'Detail: šálek, kniha a světlo (místo pro fotku)', en: 'Detail: cup, book and light (photo placeholder)' } },
    { image: 'pastry-gingerbread', ratio: '4 / 5', alt: { cs: 'Zdobené perníčky a cappuccino shora', en: 'Iced gingerbread and cappuccino from above' } },
  ],
]

/* ── Recenze ──────────────────────────────────────────
 * DŮLEŽITÉ: níže jsou UKÁZKOVÉ texty (sample: true) — zobrazují se s viditelným štítkem „ukázka“.
 * Nahraďte je skutečnými recenzemi (se svolením autorů) a nastavte sample: false.
 */
export type Review = { quote: L; author: string; source: string; sample: boolean }

export const REVIEWS: Review[] = [
  {
    quote: {
      cs: 'Sedla jsem si na deset minut a odcházela po dvou hodinách. Tak nějak to tady funguje.',
      en: 'I sat down for ten minutes and left two hours later. That’s just how it works here.',
    },
    author: 'Jméno P.',
    source: 'Google',
    sample: true,
  },
  {
    quote: {
      cs: 'Skořicový šnek, který se nedá sníst slušně. A přesně tak to má být.',
      en: 'A cinnamon roll you can’t eat politely. Exactly as it should be.',
    },
    author: 'Jméno P.',
    source: 'Google',
    sample: true,
  },
  {
    quote: {
      cs: 'Cappuccino s hedvábnou pěnou a obsluha, která se usmívá i v pondělí ráno.',
      en: 'Cappuccino with silky foam and staff who smile even on a Monday morning.',
    },
    author: 'Jméno P.',
    source: 'Google',
    sample: true,
  },
  {
    quote: {
      cs: 'Koláč s jablky stojí za cestu přes celé náměstí. I v dešti.',
      en: 'The apple tart is worth crossing the whole square for. Even in the rain.',
    },
    author: 'Jméno P.',
    source: 'Google',
    sample: true,
  },
]

/* ── Instagram (statický výběr; odkazuje na profil) ───── */
export const INSTAGRAM_TILES: { image: string; alt: L }[] = [
  { image: 'pastry-gingerbread', alt: { cs: 'Podzimní perníčky', en: 'Autumn gingerbread' } },
  { image: 'pastry-fruit-tart', alt: { cs: 'Tvarohový koláč s jablky', en: 'Quark and apple tart' } },
  { image: 'hero-coffee', alt: { cs: 'Cappuccino na pultu', en: 'Cappuccino on the counter' } },
  { image: 'pastry-choux', alt: { cs: 'Choux s karamelovým krémem', en: 'Caramel cream choux' } },
  { image: 'drink-autumn-trio', alt: { cs: 'Podzimní nápoje', en: 'Autumn drinks' } },
  { image: 'pastry-cinnamon-roll', alt: { cs: 'Skořicoví šneci', en: 'Cinnamon rolls' } },
]
