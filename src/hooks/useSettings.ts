import { useSyncExternalStore } from 'react'

export interface Settings {
  haptic: boolean
  shake: boolean
  sound: boolean
}

const DEFAULT_SETTINGS: Settings = { haptic: true, shake: true, sound: true }
const STORAGE_KEY = 'routy_settings_v1'

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
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
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)) } catch {/* 무시 */}
  notify()
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings, getSettings)
}
