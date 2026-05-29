import { generateHapticFeedback, type HapticFeedbackType } from '@apps-in-toss/web-framework'
import { isInToss } from './tossEnv'
import { getSettings } from '../hooks/useSettings'

// 강도 분류 — 호출부는 이 추상 레벨만 사용. 토스/웹 환경에 맞는 실제 매핑은 내부에서.
export type HapticStrength = 'light' | 'medium' | 'heavy' | 'success' | 'error'

const TOSS_MAP: Record<HapticStrength, HapticFeedbackType> = {
  light: 'tickWeak',
  medium: 'tickMedium',
  heavy: 'basicMedium',
  success: 'success',
  error: 'error',
}

const WEB_MAP: Record<HapticStrength, number | number[]> = {
  light: 8,
  medium: 25,
  heavy: 60,
  success: [40, 30, 60],
  error: [50, 30, 50, 30, 50],
}

export function haptic(strength: HapticStrength) {
  if (!getSettings().haptic) return
  if (isInToss()) {
    generateHapticFeedback({ type: TOSS_MAP[strength] }).catch(() => {/* 무시 */})
    return
  }
  if ('vibrate' in navigator) {
    navigator.vibrate(WEB_MAP[strength])
  }
}

// 기존 호출처 호환을 위한 별칭. 점진적으로 haptic()로 교체 가능.
export const vibrateNode = () => haptic('light')
export const vibrateDestination = () => haptic('success')
export const vibrateGameOver = () => haptic('error')
