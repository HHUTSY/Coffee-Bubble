/**
 * Підготовка фото для сайту.
 *
 *   npm run images
 *
 * 1. Бере оригінали з /images-src і зберігає оптимізовані JPG (до 2000px) у /public/images.
 *    Файли з Instagram мають мапінг на «смислові» імена (див. IG_MAP).
 *    Будь-який інший файл, напр. images-src/pastry-croissant.jpg, зберігається під тим самим іменем.
 * 2. Для кожного слоту зі SLOTS, якого ще немає в /public/images, генерує стильний
 *    градієнтний плейсхолдер у палітрі бренду (а не сірий прямокутник).
 * 3. Генерує og-image.jpg (1200×630) для соцмереж.
 *
 * WebP-варіанти (480/960/1600) створюються автоматично під час `npm run build`.
 */
import { readdir, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'images-src')
const OUT = path.join(root, 'public', 'images')

/** Instagram-оригінали → смислові імена слотів */
const IG_MAP = {
  'ig-2026-11-02-autumn-cup.jpg': 'hero-coffee.jpg',
  'ig-2026-08-26-cappuccino.jpg': 'manifesto-latte.jpg',
  'ig-2026-09-11-cinnamon-roll.jpg': 'pastry-cinnamon-roll.jpg',
  'ig-2026-09-18-choux.jpg': 'pastry-choux.jpg',
  'ig-2026-11-06-apple-cake.jpg': 'pastry-fruit-tart.jpg',
  'ig-2026-08-15-kolacek.jpg': 'pastry-kolacky.jpg',
  'ig-2026-11-10-gingerbread.jpg': 'pastry-gingerbread.jpg',
  'ig-2026-09-22-autumn-drinks.jpg': 'drink-autumn-trio.jpg',
  'ig-2026-10-26-hot-chocolate-chai.jpg': 'drink-hot-chocolate.jpg',
  'ig-2026-10-12-svarak.jpg': 'drink-svarak.jpg',
  'ig-2026-10-08-cozy.jpg': 'atmosphere-candle.jpg',
  'ig-2026-08-07-reel-cover.jpg': 'counter-pastries.jpg',
}

/** Слоти, для яких поки немає фото → плейсхолдер. [ім'я, ширина, висота, тон, підпис] */
const SLOTS = [
  ['pastry-croissant.jpg', 1600, 2000, 'caramel', 'Máslový croissant'],
  ['interior-window.jpg', 1600, 2000, 'dusk', 'Interiér · sezení u okna'],
  ['interior-counter.jpg', 2000, 1500, 'crust', 'Interiér · bar a vitrína'],
  ['interior-detail.jpg', 1600, 1600, 'cream', 'Detail · šálek, kniha, světlo'],
]

const TONES = {
  caramel: { base: '#8C4B1F', glow: '#E5A35E', deep: '#3A1F10', ink: '#F3EADC' },
  crust: { base: '#4A2814', glow: '#C98A4B', deep: '#1C120C', ink: '#F3EADC' },
  dusk: { base: '#2A1B13', glow: '#E5793A', deep: '#120C09', ink: '#F3EADC' },
  cream: { base: '#E4CFAF', glow: '#FBF7F0', deep: '#B98A5A', ink: '#3A2416' },
}

const exists = (p) => access(p).then(() => true, () => false)

function placeholderSvg(w, h, toneKey, label, file) {
  const t = TONES[toneKey]
  const r = Math.min(w, h) * 0.28
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="62%" cy="38%" r="80%">
      <stop offset="0" stop-color="${t.glow}" stop-opacity="0.95"/>
      <stop offset="0.45" stop-color="${t.base}"/>
      <stop offset="1" stop-color="${t.deep}"/>
    </radialGradient>
    <linearGradient id="leak" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.glow}" stop-opacity="0.35"/>
      <stop offset="0.4" stop-color="${t.glow}" stop-opacity="0"/>
    </linearGradient>
    <filter id="n" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="t"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.16"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#leak)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.47}" r="${r}" fill="none" stroke="${t.ink}" stroke-opacity="0.28" stroke-width="2"/>
  <circle cx="${w * 0.5}" cy="${h * 0.47}" r="${r * 0.62}" fill="${t.ink}" fill-opacity="0.06"/>
  <text x="50%" y="${h * 0.47 + 14}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="${Math.round(w * 0.045)}" fill="${t.ink}" fill-opacity="0.9">${label}</text>
  <text x="50%" y="${h - h * 0.07}" text-anchor="middle" font-family="Menlo, monospace" font-size="${Math.round(w * 0.016)}" letter-spacing="4" fill="${t.ink}" fill-opacity="0.6">${file.toUpperCase()} · ${w}×${h} · NAHRAĎTE FOTKOU</text>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`
}

async function importOriginals() {
  if (!(await exists(SRC))) return
  // files in images-src/_originals are kept as raw sources and are not published
  const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f))
  for (const f of files) {
    const target = IG_MAP[f] ?? f.replace(/\.(png|webp|heic|jpeg)$/i, '.jpg')
    await sharp(path.join(SRC, f))
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(path.join(OUT, target))
    console.log('✓', f, '→', target)
  }
}

async function makePlaceholders() {
  for (const [file, w, h, tone, label] of SLOTS) {
    const out = path.join(OUT, file)
    if (await exists(out)) continue
    await sharp(Buffer.from(placeholderSvg(w, h, tone, label, file)))
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(out)
    console.log('◌ placeholder', file)
  }
}

async function makeOgImage() {
  const hero = path.join(OUT, 'pastry-fruit-tart.jpg')
  if (!(await exists(hero))) return
  const W = 1200
  const H = 630
  const photo = await sharp(hero).resize(W, H, { fit: 'cover', position: 'attention' }).toBuffer()
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#15100C" stop-opacity="0.94"/>
      <stop offset="0.55" stop-color="#15100C" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#15100C" stop-opacity="0.05"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#d)"/>
    <text x="72" y="300" font-family="Georgia, serif" font-size="112" fill="#F3EADC">Coffee</text>
    <text x="72" y="410" font-family="Georgia, serif" font-style="italic" font-size="112" fill="#E5A35E">Bubble</text>
    <text x="76" y="500" font-family="Menlo, monospace" font-size="22" letter-spacing="5" fill="#F3EADC" fill-opacity="0.8">SPECIALTY KÁVA · POCTIVÉ PEČIVO · CHOMUTOV</text>
  </svg>`)
  await sharp(photo)
    .composite([{ input: overlay }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, 'og-image.jpg'))
  console.log('✓ og-image.jpg')
}

await mkdir(OUT, { recursive: true })
await importOriginals()
await makePlaceholders()
await makeOgImage()
