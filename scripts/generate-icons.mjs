// 토스 콘솔 업로드용 아이콘 PNG 생성기.
// 사용: node scripts/generate-icons.mjs
// 출력: assets/console/icon-600.png 등.
//
// playwright를 headless Chromium 모드로 띄워 SVG를 정확한 픽셀 크기로 렌더링.
// macOS sips는 SVG 지원이 빈약해서 playwright가 더 안전.

import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const TARGETS = [
  { src: 'public/logo-master.svg', out: 'assets/console/icon-600.png', width: 600, height: 600, bg: '#1677ff' },
  { src: 'public/logo-master-dark.svg', out: 'assets/console/icon-600-dark.png', width: 600, height: 600, bg: '#ffffff' },
  { src: 'public/thumbnail-master.svg', out: 'assets/console/thumbnail-1932x828.png', width: 1932, height: 828, bg: '#fafbff' },
]

async function run() {
  const browser = await chromium.launch()
  for (const t of TARGETS) {
    const svgText = readFileSync(resolve(root, t.src), 'utf8')
    const html = `<!doctype html>
<html><head><style>
  html,body { margin:0; padding:0; background:${t.bg}; }
  svg { display:block; width:${t.width}px; height:${t.height}px; }
</style></head><body>${svgText}</body></html>`

    const page = await browser.newPage({ viewport: { width: t.width, height: t.height }, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: 'load' })
    const outPath = resolve(root, t.out)
    mkdirSync(dirname(outPath), { recursive: true })
    await page.screenshot({ path: outPath, type: 'png', omitBackground: false, fullPage: false })
    await page.close()
    console.log(`✓ ${t.out} (${t.width}×${t.height})`)
  }
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
