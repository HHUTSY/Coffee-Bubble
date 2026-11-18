# Coffee Bubble · сайт кав'ярні

Атмосферний односторінковий сайт кав'ярні **Coffee Bubble** (Žižkovo nám. 5762, Chomutov).
Концепція «Den v bublině»: сторінка проживає один день кав'ярні. Hero о 6:00 (темрява, жар печі, пара над чашкою), далі ранок, обід, а фінал при свічках о 19:00. Арт-дирекція та дизайн-токени описані в [DESIGN.md](DESIGN.md), фото в [IMAGES.md](IMAGES.md).

**Стек:** Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3.15 (ScrollTrigger, SplitText, Flip) · Lenis · пара на чистому WebGL-шейдері (без Three.js) · шрифти Google Fonts (Fraunces, Instrument Sans, JetBrains Mono), self-hosted, `font-display: swap`.

---

## Запуск

Потрібен **Node.js 20+** (LTS). На цьому Mac він уже встановлений у `~/.local/node`. Щоб команди `node`/`npm` працювали в терміналі, один раз виконайте:

```bash
echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

Інший комп'ютер: встановіть LTS з nodejs.org.

```bash
npm install
```

```bash
npm run dev
```
Відкриється http://localhost:5173 (зміни видно одразу).

```bash
npm run build
```
Готовий сайт з'являється в папці `dist/` (+ WebP-версії фото, `robots.txt`, `sitemap.xml`).

```bash
npm run preview
```
Перегляд зібраної версії на http://localhost:4173.

```bash
npm run images
```
Стискає фото з `images-src/` у `public/images/` і створює відсутні плейсхолдери та OG-картинку.

**Публікація:** вміст `dist/` можна залити на будь-який статичний хостинг (Netlify, Vercel, Cloudflare Pages, звичайний FTP). Перед збіркою вкажіть адресу сайту у файлі `.env` (див. нижче).

---

## Як міняти контент

Усе, що редагує власник, лежить у `src/content/`. Знати React не обов'язково, достатньо змінювати текст у лапках.

| Що змінити | Файл | Підказка |
|---|---|---|
| **Тексти сторінки** (CZ та EN) | `src/content/copy.ts` | Кожен текст має пару `cs: '…', en: '…'`. `{img:pastry}` у маніфесті означає фото всередині речення. |
| **Меню, ціни, описи, профіль смаку** | `src/content/menu.ts` | `price: 75` (у Кч). `profile: [кислотність, тіло, солодкість]` 0–5. `featured: true` показує позицію в галереї «Z naší pece». Нова позиція: скопіюйте блок `{ … }`. |
| **Адреса, телефон, Instagram, години роботи** | `src/content/site.ts` | `hours`: 0 = понеділок … 6 = неділя. Свята та відпустки: `specialDays: { '2026-12-24': { open: '08:00', close: '12:00' }, '2026-12-25': null }`. Тут же час випічки для таймера (`bake.time`). |
| **Етапи «Od zrna k šálku», галерея, відгуки, плитки Instagram** | `src/content/stories.ts` | |
| **Фото** | `public/images/` | Замінюйте файл із тим самим ім'ям; повний список у [IMAGES.md](IMAGES.md). |
| **Адреса сайту для SEO** | `.env` → `VITE_SITE_URL` | Використовується в canonical, Open Graph, schema.org і sitemap. |
| **SEO-тексти, schema.org** | `index.html` | Мета-опис, OG, JSON-LD `CafeOrCoffeeShop` (години дублюються тут; змінюючи години, оновіть і їх). |

Живий статус «Otevřeno / Zavřeno · otevíráme zítra v 7:30», підсвічування «Dnes» і таймер до наступного плеха завжди рахуються за **празьким часом**, незалежно від часового поясу відвідувача.

---

## ⚠️ Перед запуском (чекліст)

1. **Домен.** `coffeebubble.cz` (саме він указаний у Google Maps) **зараз перенаправляє на чужий сайт про онлайн-казино**. Перевірте, хто володіє доменом, і оновіть посилання «Website» у профілі Google. Поки що він стоїть у `.env` як заглушка.
2. **Відгуки.** У `stories.ts` лежать **ukázkové texty** (`sample: true`), і на сайті вони позначені плашкою «Ukázkový text». Замініть їх справжніми відгуками з Google (з дозволу авторів) і поставте `sample: false`. Рейтинг 4,4 / 486 відгуків реальний (Google, 17. 11. 2026).
3. **Ціни.** Ціни, підтверджені фото з вітрини чи Instagram, мають у `menu.ts` позначку `verified: true` (svařák 79, svatební koláčky 39, koláče 69). Решту цін я підібрав орієнтовно, **їх треба перевірити**.
4. **Фото.** Замініть плейсхолдери (croissant та 3 фото інтер'єру) і дві фотографії з низькою роздільністю (`atmosphere-candle`, `counter-pastries`); див. [IMAGES.md](IMAGES.md).
5. **Години.** Взято Пн–Пт 7:30–19:00, Сб 8:00–19:00, Нд 9:00–19:00; перевірте свята в `specialDays`.
6. Телефон (+420 704 444 747) і точна адреса (Žižkovo nám. 5762) взяті з Google Maps.

---

## Що де в коді

```
src/
  content/      ← тексти, меню, години, відгуки (редагуйте тут)
  sections/     Preloader · Hero · Manifesto · Process (Od zrna k šálku) · Pastry · Oven (таймер)
                Menu (фільтри + FLIP) · Atmosphere · Reviews · Visit · Footer
  components/   SteamCanvas (WebGL-пара) · Cursor · Magnetic · Photo · RevealLines · Nav
                ThemeBackdrop (фон «дня») · DayDial · StatusPill · Toggles · ProcessArt …
  lib/          gsap.ts · smooth.ts (Lenis) · hours.ts (празький час, статус, таймер)
                audio.ts (процедурний ambient) · theme.ts · motion.ts
scripts/prepare-images.mjs   стиснення фото, плейсхолдери, OG-картинка
```

## Якість

- **Lighthouse (production, десктоп):** Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100 (LCP 0,8–0,9 с, TBT ≈ 0–20 мс, CLS < 0,03).
  Мобільний профіль Lighthouse (емуляція повільного 4G та 4× повільнішого CPU) дає Performance ≈ 80 при a11y/BP/SEO 100. Основна причина: клієнтський рендеринг React + GSAP.
- **Анімації** змінюють тільки `transform`/`opacity`; фон «дня» зроблено шарами з opacity. Пара рендериться в зниженій роздільності й зупиняється, коли hero не на екрані.
- **`prefers-reduced-motion`:** без Lenis, pin-сцен, магнітів і збирання літер; процес показується вертикальним списком, пара застигає в один кадр.
- **Мобільний:** без кастомного курсора; галерея випічки гортається пальцем; пара рендериться в меншій роздільності.
- **Доступність:** семантичні секції та заголовки, skip-link, alt-тексти, клавіатурна навігація (меню-плитки, фільтри з `aria-pressed`, карусель, lightbox з Esc), живі регіони для статусу.
- **SEO:** meta + Open Graph + Twitter, `schema.org/CafeOrCoffeeShop` (адреса, гео, години, Instagram), `robots.txt`, `sitemap.xml`, canonical.
- **Приватність:** мапа OpenStreetMap підвантажується лише після кліку; звук вимкнений за замовчуванням; жодних трекерів.
