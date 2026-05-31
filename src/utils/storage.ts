import { Storage } from '@apps-in-toss/web-framework'
import { isInToss } from './tossEnv'

// 저장소 추상화.
// - 로컬: 항상 localStorage가 1차 캐시 (동기 접근 유지 → 게임 로직 변경 최소화)
// - 토스 인앱: Toss Storage에도 미러 기록 — Toss 앱 캐시 정리/재설치 시에도 데이터 보존
// - 부팅 시 hydrate()로 Toss Storage → localStorage 백필 (필요할 때만)

const KEYS = ['best_SPEED', 'best_INFINITY', 'nc_tutorial_SPEED', 'nc_tutorial_INFINITY', 'routy_settings_v1'] as const

export function getString(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {/* 사파리 프라이빗 등 무시 */}
  // 토스 인앱: 비동기 미러. 실패해도 무시 (localStorage가 1차)
  if (isInToss()) {
    Storage.setItem(key, value).catch(() => {/* 무시 */})
  }
}

// 부팅 시 1회 호출. Toss Storage에 있는데 localStorage에 없으면(=재설치) 끌어와 채움.
// 렌더링을 막지 않음 — 백그라운드에서 비동기 진행, 끝나면 다음 set 시점에 자연스럽게 일관성 복구.
export async function hydrate(): Promise<void> {
  if (!isInToss()) return
  await Promise.all(
    KEYS.map(async key => {
      if (getString(key) !== null) return
      try {
        const v = await Storage.getItem(key)
        if (v !== null && getString(key) === null) {
          // 동시성: 그 사이 다른 코드가 set 했으면 덮어쓰지 않음
          try { localStorage.setItem(key, v) } catch {/* 무시 */}
        }
      } catch {/* 무시 */}
    })
  )
}
