import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

/** Ширини WebP-варіантів, які генеруються з public/images/*.jpg під час збірки. */
export const IMAGE_WIDTHS = [480, 960, 1600] as const

/**
 * Після збірки створює dist/images/<name>-<w>.webp для кожного JPG.
 * Канонічне фото завжди одне (public/images/<name>.jpg), тож заміна фото = заміна одного файлу.
 */
function imageVariants(): Plugin {
  let outDir = 'dist'
  return {
    name: 'coffee-bubble:image-variants',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const sharp = (await import('sharp')).default
      const dir = path.join(outDir, 'images')
      const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f) && !f.startsWith('og-'))
      await Promise.all(
        files.map(async (file) => {
          const base = file.replace(/\.jpe?g$/i, '')
          for (const width of IMAGE_WIDTHS) {
            await sharp(path.join(dir, file))
              .resize({ width, withoutEnlargement: true })
              .webp({ quality: 74, effort: 5 })
              .toFile(path.join(dir, `${base}-${width}.webp`))
          }
        }),
      )
      this.info?.(`image variants: ${files.length} photos × ${IMAGE_WIDTHS.length} widths`)
    },
  }
}

/** robots.txt + sitemap.xml з однієї змінної VITE_SITE_URL. */
function seoFiles(siteUrl: string): Plugin {
  let outDir = 'dist'
  return {
    name: 'coffee-bubble:seo-files',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const url = siteUrl.replace(/\/$/, '')
      await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`)
      await writeFile(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: process.env.BASE_PATH ?? '/',
    plugins: [react(), tailwindcss(), imageVariants(), seoFiles(env.VITE_SITE_URL ?? 'https://example.com')],
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/gsap')) return 'gsap'
            if (id.includes('node_modules/react')) return 'react'
          },
        },
      },
    },
    server: { port: 5173, host: true },
  }
})
