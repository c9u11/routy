import { getAnonymousKey } from '@apps-in-toss/web-framework'
import { isInToss } from './tossEnv'

// 토스 미니앱에서 발급되는 익명 사용자 식별 해시.
// PII 아님 — 같은 사용자가 동일 미니앱에서 일관된 hash를 얻음 (재설치/세션 무관).
// 향후 리더보드, 광고 보상 어뷰징 방지, 서버 동기화 등에서 활용.

let cached: string | null = null
let inflight: Promise<string | null> | null = null

// 비동기로 한 번만 가져와 캐시. 토스 외부 환경에선 항상 null.
export async function fetchAnonymousKey(): Promise<string | null> {
  if (cached !== null) return cached
  if (inflight) return inflight
  if (!isInToss()) {
    cached = null
    return null
  }
  inflight = (async () => {
    try {
      const result = await getAnonymousKey()
      if (!result || result === 'ERROR') return null
      if (result.type === 'HASH') {
        cached = result.hash
        return cached
      }
      return null
    } catch {
      return null
    } finally {
      inflight = null
    }
  })()
  return inflight
}

// 동기 접근 — 이미 fetch된 경우만 값 반환. 아직 안 됐으면 null.
export function getCachedAnonymousKey(): string | null {
  return cached
}
