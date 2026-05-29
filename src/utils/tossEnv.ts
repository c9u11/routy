import { getAppsInTossGlobals } from '@apps-in-toss/web-framework'

let cachedInToss: boolean | null = null

// Toss 인앱(또는 개발용 샌드박스) 환경 여부 감지.
// getAppsInTossGlobals()는 외부에서 호출하면 throw하거나 의미 없는 값 반환 — try/catch로 안전 처리.
export function isInToss(): boolean {
  if (cachedInToss !== null) return cachedInToss
  try {
    const globals = getAppsInTossGlobals()
    cachedInToss = !!globals?.deploymentId
  } catch {
    cachedInToss = false
  }
  return cachedInToss
}
