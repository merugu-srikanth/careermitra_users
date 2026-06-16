/**
 * CareerMitra PWA Icon Generator
 *
 * Run once: node generate-pwa-icons.mjs
 * Requires: npm install sharp --save-dev
 *
 * Reads public/NewLogo.png → generates all icon sizes into public/pwa-icons/
 * Also writes public/favicon.png (32x32) to replace the React SVG favicon
 */

import sharp from 'sharp'
import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE = join(__dirname, 'public', 'NewLogo.png')
const OUT_DIR = join(__dirname, 'public', 'pwa-icons')
const PUBLIC_DIR = join(__dirname, 'public')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

// Favicon sizes (browser tab) + PWA icon sizes
const SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]

async function generate() {
  console.log('Generating CareerMitra icons from', SOURCE, '\n')

  // Standard icons — white background so logo is visible on any background
  for (const size of SIZES) {
    const outPath = join(OUT_DIR, `icon-${size}x${size}.png`)
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(outPath)
    console.log(`  Created icon-${size}x${size}.png`)
  }

  // Maskable icons (Android adaptive icons)
  // Safe zone = 80% of canvas; 10% padding each side; blue brand background
  for (const size of [192, 512]) {
    const padding = Math.round(size * 0.1)
    const innerSize = size - padding * 2
    const outPath = join(OUT_DIR, `icon-maskable-${size}x${size}.png`)
    await sharp(SOURCE)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toFile(outPath)
    console.log(`  Created icon-maskable-${size}x${size}.png`)
  }

  // Write favicon.png (32x32) directly to /public so browsers pick it up
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(join(PUBLIC_DIR, 'favicon.png'))
  console.log('\n  Created public/favicon.png (browser tab favicon)')

  console.log('\nDone! All CareerMitra icons generated.')
  console.log('React SVG favicon is now replaced — run `npm run build` to see changes.')
}

generate().catch(err => {
  console.error('Error:', err.message)
  console.error('\nInstall sharp first: npm install sharp --save-dev')
  process.exit(1)
})
