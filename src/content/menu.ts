/**
 * ─────────────────────────────────────────────────────────────
 *  MENU A CENY  ·  тут міняються позиції, ціни, описи, профілі смаку
 * ─────────────────────────────────────────────────────────────
 *  price      — cena v Kč (číslo)
 *  profile    — tři hodnoty 0–5 (význam podle kategorie, viz PROFILE_AXES)
 *  image      — název fotky v /public/images bez přípony (nepovinné)
 *  featured   — true = položka se ukáže i v galerii „Z naší pece“
 *  verified   — true = cena ověřená z vitríny/Instagramu; ostatní ceny prosím zkontrolujte
 */
import type { L } from './i18n'

export type Category = 'coffee' | 'pastry' | 'seasonal'

export type MenuItem = {
  id: string
  category: Category
  name: L
  note: L
  size?: L
  price: number
  profile: [number, number, number]
  image?: string
  alt?: L
  featured?: boolean
  verified?: boolean
}

export const PROFILE_AXES: Record<Category, [L, L, L]> = {
  coffee: [
    { cs: 'Kyselost', en: 'Acidity' },
    { cs: 'Tělo', en: 'Body' },
    { cs: 'Sladkost', en: 'Sweetness' },
  ],
  pastry: [
    { cs: 'Sladkost', en: 'Sweetness' },
    { cs: 'Máslovost', en: 'Butter' },
    { cs: 'Křupavost', en: 'Crunch' },
  ],
  seasonal: [
    { cs: 'Sladkost', en: 'Sweetness' },
    { cs: 'Kořenitost', en: 'Spice' },
    { cs: 'Hřejivost', en: 'Warmth' },
  ],
}

export const MENU: MenuItem[] = [
  // ── Káva ────────────────────────────────────────────
  {
    id: 'espresso',
    category: 'coffee',
    name: { cs: 'Espresso', en: 'Espresso' },
    note: {
      cs: 'Krátké a husté, s karamelovou sladkostí a čistým dozvukem.',
      en: 'Short and dense, with caramel sweetness and a clean finish.',
    },
    size: { cs: '18 g → 36 g', en: '18 g → 36 g' },
    price: 55,
    profile: [3, 4, 3],
  },
  {
    id: 'cappuccino',
    category: 'coffee',
    name: { cs: 'Cappuccino', en: 'Cappuccino' },
    note: {
      cs: 'Espresso a hedvábně našlehané mléko. Klasika, kterou umíme nazpaměť.',
      en: 'Espresso and silky steamed milk. The classic we know by heart.',
    },
    size: { cs: '180 ml', en: '180 ml' },
    price: 75,
    profile: [2, 4, 4],
    image: 'hero-coffee',
    alt: { cs: 'Cappuccino s latte artem', en: 'Cappuccino with latte art' },
  },
  {
    id: 'flat-white',
    category: 'coffee',
    name: { cs: 'Flat white', en: 'Flat white' },
    note: {
      cs: 'Dvojité espresso a tenká vrstva mléka. Víc kávy, méně pěny.',
      en: 'Double espresso, thin layer of milk. More coffee, less foam.',
    },
    size: { cs: '160 ml', en: '160 ml' },
    price: 85,
    profile: [3, 4, 3],
  },
  {
    id: 'latte',
    category: 'coffee',
    name: { cs: 'Caffè latte', en: 'Caffè latte' },
    note: {
      cs: 'Jemné a mléčné. Na dlouhé povídání u okna.',
      en: 'Soft and milky. Made for long chats by the window.',
    },
    size: { cs: '300 ml', en: '300 ml' },
    price: 85,
    profile: [1, 3, 4],
    image: 'manifesto-latte',
    alt: { cs: 'Latte v keramickém šálku vedle svíčky', en: 'Latte in a ceramic cup next to a candle' },
  },
  {
    id: 'filter',
    category: 'coffee',
    name: { cs: 'Filtrovaná káva', en: 'Filter coffee' },
    note: {
      cs: 'Ručně překapávaná. Ovocné tóny, lehké tělo, čistá jako čaj.',
      en: 'Hand-brewed pour-over. Fruity notes, light body, clean as tea.',
    },
    size: { cs: 'V60 · 250 ml', en: 'V60 · 250 ml' },
    price: 79,
    profile: [4, 2, 3],
  },

  // ── Pečivo ──────────────────────────────────────────
  {
    id: 'cinnamon-roll',
    category: 'pastry',
    name: { cs: 'Skořicový šnek', en: 'Cinnamon roll' },
    note: {
      cs: 'Nadýchané kynuté těsto, skořice a pořádná vrstva polevy.',
      en: 'Pillowy yeasted dough, cinnamon and a generous layer of frosting.',
    },
    price: 69,
    profile: [5, 4, 1],
    image: 'pastry-cinnamon-roll',
    alt: { cs: 'Plech skořicových šneků s polevou těsně po upečení', en: 'A tray of frosted cinnamon rolls fresh from the oven' },
    featured: true,
  },
  {
    id: 'fruit-tart',
    category: 'pastry',
    name: { cs: 'Tvarohový koláč s ovocem', en: 'Quark tart with apples' },
    note: {
      cs: 'Jablka skládaná do růže, krémový tvaroh a cukr jako první sníh.',
      en: 'Apples folded into a rose, creamy quark and sugar like first snow.',
    },
    price: 69,
    profile: [3, 3, 2],
    image: 'pastry-fruit-tart',
    alt: { cs: 'Tvarohový koláč s jablky skládanými do růže na pultu', en: 'Quark tart with apple slices arranged like a rose on the counter' },
    featured: true,
    verified: true,
  },
  {
    id: 'choux',
    category: 'pastry',
    name: { cs: 'Choux s karamelovým krémem', en: 'Caramel cream choux' },
    note: {
      cs: 'Odpalované těsto s křupavou krustou, jemný krém a drobenka navrch.',
      en: 'Choux pastry with a crackly crust, silky cream and crumble on top.',
    },
    price: 79,
    profile: [4, 3, 4],
    image: 'pastry-choux',
    alt: { cs: 'Šest choux s karamelovým krémem a drobenkou na bílém podnose', en: 'Six caramel-cream choux buns with crumble on a white platter' },
    featured: true,
  },
  {
    id: 'kolacky',
    category: 'pastry',
    name: { cs: 'Svatební koláčky', en: 'Wedding koláčky' },
    note: {
      cs: 'Malé kulaté koláčky s povidly, tvarohem a mákem. Jako od babičky.',
      en: 'Little round koláčky with plum jam, quark and poppy seed. Like grandma’s.',
    },
    price: 39,
    profile: [3, 3, 2],
    image: 'pastry-kolacky',
    alt: { cs: 'Svatební a kynuté koláče ve skleněné vitríně', en: 'Wedding and yeasted koláče in a glass display' },
    featured: true,
    verified: true,
  },
  {
    id: 'kynuty-kolac',
    category: 'pastry',
    name: { cs: 'Kynutý koláč', en: 'Yeasted koláč' },
    note: {
      cs: 'Kynuté těsto, poctivá náplň a voňavá drobenka. Přesně takový, jaký má být.',
      en: 'Yeasted dough, honest filling and fragrant crumble. Exactly as it should be.',
    },
    price: 69,
    profile: [3, 3, 3],
    verified: true,
  },
  {
    id: 'croissant',
    category: 'pastry',
    name: { cs: 'Máslový croissant', en: 'Butter croissant' },
    note: {
      cs: 'Vrstvy másla a těsta, které při kousnutí zapraskají.',
      en: 'Layers of butter and dough that crackle at first bite.',
    },
    price: 49,
    profile: [2, 5, 5],
    image: 'pastry-croissant',
    alt: { cs: 'Máslový croissant (ilustrační místo pro fotku)', en: 'Butter croissant (placeholder for a photo)' },
    featured: true,
  },

  // ── Sezónní ─────────────────────────────────────────
  {
    id: 'pumpkin-matcha',
    category: 'seasonal',
    name: { cs: 'Pumpkin Cream Matcha', en: 'Pumpkin Cream Matcha' },
    note: {
      cs: 'Matcha, dýňová pěna a špetka skořice. Podzim ve sklenici.',
      en: 'Matcha, pumpkin cream foam and a pinch of cinnamon. Autumn in a glass.',
    },
    price: 109,
    profile: [4, 3, 3],
    image: 'drink-autumn-trio',
    alt: { cs: 'Pumpkin Cream Matcha, chai latte a horká čokoláda na stole', en: 'Pumpkin Cream Matcha, chai latte and hot chocolate on a table' },
  },
  {
    id: 'chai',
    category: 'seasonal',
    name: { cs: 'Chai latte', en: 'Chai latte' },
    note: {
      cs: 'Černý čaj, kardamom, zázvor a skořice s napěněným mlékem.',
      en: 'Black tea, cardamom, ginger and cinnamon with steamed milk.',
    },
    price: 89,
    profile: [3, 5, 4],
  },
  {
    id: 'hot-chocolate',
    category: 'seasonal',
    name: { cs: 'Horká čokoláda', en: 'Hot chocolate' },
    note: {
      cs: 'Hustá, hořká tak akorát, s latte artem navrch.',
      en: 'Thick, just bitter enough, with latte art on top.',
    },
    price: 85,
    profile: [4, 1, 5],
    image: 'drink-hot-chocolate',
    alt: { cs: 'Horká čokoláda a chai latte shora, kousky čokolády a skořice', en: 'Hot chocolate and chai latte from above with chocolate and cinnamon' },
  },
  {
    id: 'svarak',
    category: 'seasonal',
    name: { cs: 'Svařák', en: 'Mulled wine' },
    note: {
      cs: 'Svařené víno s pomerančem a hřebíčkem. Sezóna je oficiálně tady.',
      en: 'Mulled wine with orange and clove. The season is officially here.',
    },
    size: { cs: '200 ml', en: '200 ml' },
    price: 79,
    profile: [3, 4, 5],
    image: 'drink-svarak',
    alt: { cs: 'Křídová cedulka Svařák 79 Kč vedle dýně a sušených květin', en: 'Chalk sign “Svařák 79 CZK” next to a pumpkin and dried flowers' },
    verified: true,
  },
  {
    id: 'gingerbread',
    category: 'seasonal',
    name: { cs: 'Podzimní perníčky', en: 'Autumn gingerbread' },
    note: {
      cs: 'Ručně zdobené listy, žaludy a jablíčka. Skoro škoda je jíst.',
      en: 'Hand-iced leaves, acorns and apples. Almost too pretty to eat.',
    },
    price: 59,
    profile: [4, 4, 2],
    image: 'pastry-gingerbread',
    alt: { cs: 'Ručně zdobené podzimní perníčky vedle cappuccina', en: 'Hand-iced autumn gingerbread next to a cappuccino' },
    featured: true,
  },
]
