/**
 * CareerMitra PWA Icon Generator
 *
 * Run once: node generate-pwa-icons.mjs
 * Requires: npm install sharp --save-dev
 *
 * Reads public/NewLogo.png → generates all PWA icon sizes into public/pwa-icons/
 */

import sharp from 'sharp'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE = join(__dirname, 'public', 'NewLogo.png')
const OUT_DIR = join(__dirname, 'public', 'pwa-icons')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

async function generate() {
  console.log('Generating PWA icons from', SOURCE)

  // Standard icons
  for (const size of SIZES) {
    const outPath = join(OUT_DIR, `icon-${size}x${size}.png`)
    await sharp(SOURCE).resize(size, size, { fit: 'contain', background: '#ffffff' }).png().toFile(outPath)
    console.log(`  Created ${outPath}`)
  }

  // Maskable icons (with safe-zone padding — content fills ~80% of canvas)
  for (const size of [192, 512]) {
    const padding = Math.round(size * 0.1)
    const innerSize = size - padding * 2
    const outPath = join(OUT_DIR, `icon-maskable-${size}x${size}.png`)
    await sharp(SOURCE)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 30, g: 58, b: 138, alpha: 1 } })
      .extend({ top: padding, bottom: padding, left: padding, right: padding, background: { r: 30, g: 58, b: 138, alpha: 1 } })
      .png()
      .toFile(outPath)
    console.log(`  Created ${outPath} (maskable)`)
  }

  console.log('\nDone! All PWA icons generated in public/pwa-icons/')
}

generate().catch(err => {
  console.error('Error:', err.message)
  console.error('\nInstall sharp first: npm install sharp --save-dev')
  process.exit(1)
})
