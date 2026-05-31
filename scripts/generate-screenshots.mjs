// 콘솔/스토어 업로드용 스크린샷 생성기 (한국어 + 영어).
// 사용: npm run screenshots            (토스용 636×1048)
//       npm run screenshots:appstore   (App Store 1284×2778)
//       npm run screenshots:ipad        (iPad 2048×2732)
// 사전조건: 다른 터미널에서 `npm run dev:vite` 실행 중이어야 함.
// 출력: <outDir>/ko/01-home.png, <outDir>/en/01-home.png ...

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173'

// 콘솔별 캡처 묶음 — 토스(작은 세로) + App Store(6.5"/6.7" iPhone) + iPad 13"
const PROFILES = {
  toss: {
    viewport: { width: 636, height: 1048 },
    deviceScaleFactor: 1,
    outDir: 'assets/console/screenshots',
  },
  appstore: {
    // 428×926 logical × DSR 3 = 1284×2778 (6.5"/6.7" 슬롯)
    viewport: { width: 428, height: 926 },
    deviceScaleFactor: 3,
    outDir: 'assets/appstore/screenshots',
  },
  ipad: {
    // 1024×1366 logical × DSR 2 = 2048×2732 (13" iPad 슬롯)
    viewport: { width: 1024, height: 1366 },
    deviceScaleFactor: 2,
    outDir: 'assets/appstore/screenshots-ipad',
  },
}

const profile = PROFILES[process.env.SCREENSHOT_PROFILE ?? 'toss']
if (!profile) {
  console.error(`알 수 없는 프로필: ${process.env.SCREENSHOT_PROFILE}. toss / appstore / ipad 사용.`)
  process.exit(1)
}

const VIEWPORT = profile.viewport
const OUT_ROOT = resolve(root, profile.outDir)

// 캡처 시 결정적 상태로 고정: 모드별 튜토리얼 닫음 + 언어/테마 지정(라이트).
function seedStorage(lang) {
  localStorage.setItem('nc_tutorial_SPEED', '1')
  localStorage.setItem('nc_tutorial_INFINITY', '1')
  localStorage.setItem(
    'routy_settings_v1',
    JSON.stringify({ haptic: true, shake: true, sound: true, lang, theme: 'light' })
  )
}

async function shot(page, dir, name) {
  await page.screenshot({ path: resolve(dir, name), type: 'png', fullPage: false })
  console.log(`✓ ${name}`)
}

async function clickByText(page, text) {
  await page.evaluate(t => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes(t))
    btn?.click()
  }, text)
}

async function captureLocale(browser, lang) {
  const outDir = resolve(OUT_ROOT, lang)
  mkdirSync(outDir, { recursive: true })
  console.log(`\n=== ${lang} → ${profile.outDir}/${lang} ===`)

  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    locale: lang === 'ko' ? 'ko-KR' : 'en-US',
  })
  await ctx.addInitScript(seedStorage, lang)
  const page = await ctx.newPage()

  // 1) 홈
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(300)
  await shot(page, outDir, '01-home.png')

  // 2) Speed (모드 이름은 양 언어 공통 'Speed Mode')
  await clickByText(page, 'Speed Mode')
  await page.waitForTimeout(500)
  await shot(page, outDir, '02-speed.png')

  // 3) 홈으로 되돌아가 Infinity (reload → HOME 초기화)
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  await clickByText(page, 'Infinity Mode')
  await page.waitForTimeout(500)
  await shot(page, outDir, '03-infinity.png')

  await ctx.close()
}

async function run() {
  const browser = await chromium.launch()
  for (const lang of ['ko', 'en']) {
    await captureLocale(browser, lang)
  }
  await browser.close()
}

run().catch(err => {
  console.error('스크린샷 실패. dev 서버가 떠 있는지 확인하세요. (npm run dev:vite)')
  console.error(err)
  process.exit(1)
})
