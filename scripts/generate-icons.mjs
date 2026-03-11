/**
 * Generate PWA icons for ObraKit
 * Run: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// ObraKit brand colors
const NAVY = '#1B2A4A'
const ORANGE = '#F97316'
const WHITE = '#FFFFFF'

function createIconSvg(size) {
  const fontSize = Math.round(size * 0.38)
  const subtextSize = Math.round(size * 0.11)
  const borderRadius = Math.round(size * 0.18)
  const barHeight = Math.round(size * 0.06)
  const barY = Math.round(size * 0.78)
  const barWidth = Math.round(size * 0.45)
  const barX = Math.round((size - barWidth) / 2)

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${borderRadius}" fill="${NAVY}"/>
  <text
    x="50%"
    y="48%"
    font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    fill="${WHITE}"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="-${Math.round(size * 0.01)}"
  >OK</text>
  <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="${Math.round(barHeight / 2)}" fill="${ORANGE}"/>
</svg>`
}

const sizes = [192, 512]

for (const size of sizes) {
  const svg = createIconSvg(size)
  const outputPath = join(publicDir, `icon-${size}.png`)

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath)

  console.log(`✅ Created icon-${size}.png`)
}

// Also create a favicon.ico (32x32)
const faviconSvg = createIconSvg(32)
await sharp(Buffer.from(faviconSvg))
  .png()
  .toFile(join(publicDir, 'favicon.ico'))

console.log('✅ Created favicon.ico')

// Create apple-touch-icon (180x180)
const appleSvg = createIconSvg(180)
await sharp(Buffer.from(appleSvg))
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'))

console.log('✅ Created apple-touch-icon.png')

console.log('\n🎉 All icons generated in /public')
