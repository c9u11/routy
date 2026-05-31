import { useSyncExternalStore } from 'react'
import type { ThemePref } from '../hooks/useSettings'
import { useSettings } from '../hooks/useSettings'

export type ResolvedTheme = 'light' | 'dark'

// 중립 색(배경/표면/텍스트/보더)만 테마화. brand/semantic 색(파랑·초록·빨강 등)은
// 양 테마에서 흰 글자와 함께 쓰이므로 컴포넌트에서 그대로 사용.
export interface Theme {
  mode: ResolvedTheme
  bg: string            // 앱 배경
  surface: string       // 카드/모달 표면
  surfaceAlt: string    // 인셋 박스(점수 박스·세그먼트 트랙·아이콘 배경)
  overlay: string       // 모달 스크림
  overlayStrong: string // 튜토리얼 스크림
  gameOverScrim: string // 게임오버 블러 스크림
  text: string          // 기본 텍스트
  textSecondary: string // 보조 텍스트
  textMuted: string     // 흐린 텍스트
  textFaint: string     // 가장 흐린 텍스트
  border: string        // 옅은 보더
  toggleOff: string     // 토글 off / 빈 하트
  nodeDefault: string   // 기본 그리드 타일 배경
}

export const lightTheme: Theme = {
  mode: 'light',
  bg: '#fafbff',
  surface: '#ffffff',
  surfaceAlt: '#f5f8ff',
  overlay: 'rgba(0,0,0,0.5)',
  overlayStrong: 'rgba(0,0,0,0.6)',
  gameOverScrim: 'rgba(255,255,255,0.92)',
  text: '#1a1a2e',
  textSecondary: '#595959',
  textMuted: '#8c8c8c',
  textFaint: '#bfbfbf',
  border: '#f0f0f0',
  toggleOff: '#d9d9d9',
  nodeDefault: '#f0f5ff',
}

export const darkTheme: Theme = {
  mode: 'dark',
  bg: '#0f1115',
  surface: '#1a1d24',
  surfaceAlt: '#22262f',
  overlay: 'rgba(0,0,0,0.6)',
  overlayStrong: 'rgba(0,0,0,0.72)',
  gameOverScrim: 'rgba(15,17,21,0.92)',
  text: '#f0f2f5',
  textSecondary: '#c2c6cc',
  textMuted: '#8b9099',
  textFaint: '#5c626b',
  border: '#2c313a',
  toggleOff: '#3a3f48',
  nodeDefault: '#22262f',
}

function getSystemDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

// 선호값 + OS 설정으로 실효 테마 객체 해석 (훅 아님 — main.tsx 초기 페인트용).
export function resolveTheme(pref: ThemePref): Theme {
  const dark = pref === 'dark' || (pref === 'system' && getSystemDark())
  return dark ? darkTheme : lightTheme
}

function subscribeSystem(cb: () => void): () => void {
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  } catch {
    return () => {}
  }
}

function useSystemDark(): boolean {
  return useSyncExternalStore(subscribeSystem, getSystemDark, () => false)
}

export function useTheme(): Theme {
  const { theme } = useSettings()
  const systemDark = useSystemDark()
  const dark = theme === 'dark' || (theme === 'system' && systemDark)
  return dark ? darkTheme : lightTheme
}

// 문서 chrome(바디 배경 + theme-color 메타) 갱신. 초기 페인트(main.tsx)와 테마 변경 시 호출.
export function applyDocumentChrome(theme: Theme): void {
  try {
    document.body.style.background = theme.bg
    let meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', theme.bg)
  } catch {
    /* 무시 */
  }
}
