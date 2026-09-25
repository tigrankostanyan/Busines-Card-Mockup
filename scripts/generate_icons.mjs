// Ժամանակավոր սկրիպտ՝ SVG լոգոյից իկոնաներ ստեղծելու համար
// Usage: node scripts/generate_icons.mjs
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const root = path.resolve(import.meta.dirname, '..')
const svgPath = path.join(root, 'build', 'logo.svg')

const sizes = [16, 32, 48, 64, 128, 256, 512]

// 1. build/icon.png — electron-builder-ի հիմնական իկոն (512x512)
await sharp(svgPath, { density: 300 })
  .resize(512, 512)
  .png()
  .toFile(path.join(root, 'build', 'icon.png'))

// 2. public/icon-*.png — favicon և BrowserWindow-ի իկոն
const publicDir = path.join(root, 'public')
fs.mkdirSync(publicDir, { recursive: true })

for (const s of sizes) {
  await sharp(svgPath, { density: 300 })
    .resize(s, s)
    .png()
    .toFile(path.join(publicDir, `icon-${s}.png`))
}

// 3. ICO ֆայլ՝ բազմաչափ (electron-builder-ը կարող է ինքնուրույն փոխարկել PNG→ICO,
//    բայց հուսալիության համար ստեղծում ենք նաև պատրաստի .ico)
//    Sharp-ը չի աջակցում ICO, ուստի օգտագործում ենք PNG-ների մասշտաբավորված տարբերակը
//    որպես .ico աղբյուր (electron-builder-ը կընդունի build/icon.png 512x512):

console.log('ICONS_GENERATED:')
for (const s of sizes) {
  console.log(`  public/icon-${s}.png`)
}
console.log('  build/icon.png')
