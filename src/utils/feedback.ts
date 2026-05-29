import { haptic, type HapticStrength } from './haptic'
import { getSettings } from '../hooks/useSettings'

export type ShakeStrength = 'light' | 'medium' | 'heavy'

const CLASS_MAP: Record<ShakeStrength, string> = {
  light: 'shake-light',
  medium: 'shake-medium',
  heavy: 'shake-heavy',
}

const DURATION_MAP: Record<ShakeStrength, number> = {
  light: 180,
  medium: 280,
  heavy: 450,
}

// 흔들기 대상이 되는 루트 엘리먼트 (App.tsx에서 등록)
let shakeRoot: HTMLElement | null = null

export function registerShakeRoot(el: HTMLElement | null) {
  shakeRoot = el
}

export function shake(strength: ShakeStrength) {
  if (!getSettings().shake || !shakeRoot) return
  // 기존 클래스 제거 후 재적용 — 연속 호출 시 애니메이션이 재시작되도록
  const className = CLASS_MAP[strength]
  shakeRoot.classList.remove(className)
  // 강제 reflow
  void shakeRoot.offsetWidth
  shakeRoot.classList.add(className)
  setTimeout(() => {
    shakeRoot?.classList.remove(className)
  }, DURATION_MAP[strength])
}

// 햅틱 + 흔들기 (필요 시 사운드도 추후 추가)를 한 번에 트리거하는 편의 함수.
export function feedback(opts: { haptic?: HapticStrength; shake?: ShakeStrength }) {
  if (opts.haptic) haptic(opts.haptic)
  if (opts.shake) shake(opts.shake)
}
