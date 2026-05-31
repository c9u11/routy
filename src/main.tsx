import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { getSettings } from './hooks/useSettings'
import { resolveTheme, applyDocumentChrome } from './theme/theme'

// 첫 페인트 전에 저장된 테마로 바디 배경/theme-color 적용 (다크 모드 흰 화면 깜빡임 방지)
applyDocumentChrome(resolveTheme(getSettings().theme))

// PWA service worker 등록 — TWA가 Play 콘솔에 인정받기 위한 PWA 요건.
// 프로덕션에서만 등록 (Vercel)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {/* 무시 */})
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
