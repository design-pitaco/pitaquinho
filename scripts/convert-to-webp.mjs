// Converte para WebP os PNGs de src/assets acima do limite de tamanho.
// Uso: node scripts/convert-to-webp.mjs [--threshold=250000] [--quality=80]
// Gera o .webp ao lado do .png e imprime tamanhos; a remocao dos .png e a
// atualizacao dos imports ficam a cargo de quem roda.
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value]
  })
)

const threshold = Number(args.threshold ?? 250_000)
const quality = Number(args.quality ?? 80)
const assetsDir = path.resolve(scriptDir, '../src/assets')

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name)
      return entry.isDirectory() ? walk(fullPath) : [fullPath]
    })
  )
  return files.flat()
}

const formatKb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

const pngs = (await walk(assetsDir)).filter((file) => file.endsWith('.png'))
let totalBefore = 0
let totalAfter = 0

for (const file of pngs) {
  const { size } = await stat(file)
  if (size < threshold) continue

  const output = file.replace(/\.png$/, '.webp')
  await sharp(file).webp({ quality, effort: 6 }).toFile(output)
  const { size: webpSize } = await stat(output)
  totalBefore += size
  totalAfter += webpSize
  console.log(`${path.relative(assetsDir, file)}: ${formatKb(size)} -> ${formatKb(webpSize)}`)
}

console.log(`\nTotal: ${formatKb(totalBefore)} -> ${formatKb(totalAfter)}`)
