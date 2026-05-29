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

// 콘솔별로 캡처 묶음을 분리 — 토스(작은 세로) + App Store(큰 세로, 6.7" iPhone)
const PROFILES = {
  toss: {
    viewport: { width: 636, height: 1048 },
    deviceScaleFactor: 1,
    outDir: 'assets/console/screenshots',
  },
  appstore: {
    // App Store Connect 6.5"/6.7" 슬롯이 요구하는 1284×2778 (또는 1242×2688) 중 큰 쪽.
    // iPhone 11 Pro Max / 14 Pro Max — logical 428×926 × DSR 3 = 픽셀 1284×2778.
    // 1290×2796 (6.9", iPhone 15 Pro Max)은 별도 슬롯이라 본 슬롯에 업로드 불가.
    viewport: { width: 428, height: 926 },
    deviceScaleFactor: 3,
    outDir: 'assets/appstore/screenshots',
  },
  ipad: {
    // App Store Connect 13" iPad 슬롯 — 2048×2732 PNG (12.9" iPad Pro / 13" iPad Pro M4).
    // logical 1024×1366 × DSR 2 = 픽셀 2048×2732.
    viewport: { width: 1024, height: 1366 },
    deviceScaleFactor: 2,
    outDir: 'assets/appstore/screenshots-ipad',
  },
}

const profile = PROFILES[process.env.SCREENSHOT_PROFILE ?? 'toss']
if (!profile) {
  console.error(`알 수 없는 프로필: ${process.env.SCREENSHOT_PROFILE}. toss 또는 appstore 사용.`)
  process.exit(1)
}

const VIEWPORT = profile.viewport
const OUT_DIR = resolve(root, profile.outDir)
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
    deviceScaleFactor: profile.deviceScaleFactor,
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
