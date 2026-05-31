import { useSyncExternalStore } from 'react'
import { getString, setString } from '../utils/storage'

export type Lang = 'ko' | 'en'
export type ThemePref = 'system' | 'light' | 'dark'

export interface Settings {
  haptic: boolean
  shake: boolean
  sound: boolean
  lang: Lang
  theme: ThemePref
}

// 기기 언어 기준 초기값: 한국어면 ko, 그 외 en.
function detectLang(): Lang {
  try {
    return (navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en'
  } catch {
    return 'ko'
  }
}

const DEFAULT_SETTINGS: Settings = { haptic: true, shake: true, sound: true, lang: detectLang(), theme: 'system' }
const STORAGE_KEY = 'routy_settings_v1'

function load(): Settings {
  try {
    const raw = getString(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

let current: Settings = load()
const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

function notify() {
  listeners.forEach(cb => cb())
}

export function getSettings(): Settings {
  return current
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  current = { ...current, [key]: value }
  setString(STORAGE_KEY, JSON.stringify(current))
  notify()
}

// hydrate() 이후 호출. localStorage가 비어 있던 키가 채워졌다면 메모리 캐시 재동기화.
export function reloadSettings() {
  current = load()
  notify()
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings, getSettings)
}
