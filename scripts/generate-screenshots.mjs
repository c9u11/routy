// 토스 콘솔 업로드용 스크린샷(636×1048 세로) 생성기.
// 사용: npm run screenshots
// 사전조건: 다른 터미널에서 `npm run dev:vite` 실행 중이어야 함.
// 출력: assets/console/screenshots/01-home.png 등.

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173'
const VIEWPORT = { width: 636, height: 1048 }

const OUT_DIR = resolve(root, 'assets/console/screenshots')
mkdirSync(OUT_DIR, { recursive: true })

async function shot(page, name) {
  const out = resolve(OUT_DIR, name)
  await page.screenshot({ path: out, type: 'png', fullPage: false })
  console.log(`✓ ${name}`)
}

async function run() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    locale: 'ko-KR',
  })
  const page = await ctx.newPage()

  // 1) 홈 화면 — 튜토리얼이 떠 있으면 dismiss
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  // 튜토리얼 노출 여부 체크: '시작하기' 버튼 있으면 닫음 (한 번도 안 본 사용자 상태)
  await page.evaluate(() => localStorage.setItem('nc_tutorial_done', '1'))
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(300)
  await shot(page, '01-home.png')

  // 2) Speed 모드 — 카드 클릭 후 잠시 대기
  await page.evaluate(() => {
    // 모드 카드 두 개 중 첫 번째 (Speed)
    const buttons = Array.from(document.querySelectorAll('button'))
    const speedBtn = buttons.find(b => b.textContent?.includes('Speed Mode'))
    speedBtn?.click()
  })
  await page.waitForTimeout(500)
  await shot(page, '02-speed.png')

  // 3) Infinity 모드 — 홈으로 돌아가 Infinity 클릭
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const home = buttons.find(b => b.textContent?.includes('홈'))
    home?.click()
  })
  await page.waitForTimeout(300)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const infBtn = buttons.find(b => b.textContent?.includes('Infinity Mode'))
    infBtn?.click()
  })
  await page.waitForTimeout(500)
  await shot(page, '03-infinity.png')

  await browser.close()
}

run().catch(err => {
  console.error('스크린샷 실패. dev 서버가 떠 있는지 확인하세요. (npm run dev:vite)')
  console.error(err)
  process.exit(1)
})
