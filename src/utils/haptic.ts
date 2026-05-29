import { generateHapticFeedback, type HapticFeedbackType } from '@apps-in-toss/web-framework'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { isInToss } from './tossEnv'
import { getSettings } from '../hooks/useSettings'

// 강도 분류 — 호출부는 이 추상 레벨만 사용. 환경별(Toss / Capacitor / 웹) 매핑은 내부에서.
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

function capacitorHaptic(strength: HapticStrength) {
  switch (strength) {
    case 'light':
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
      return
    case 'medium':
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
      return
    case 'heavy':
      Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
      return
    case 'success':
      Haptics.notification({ type: NotificationType.Success }).catch(() => {})
      return
    case 'error':
      Haptics.notification({ type: NotificationType.Error }).catch(() => {})
      return
  }
}

export function haptic(strength: HapticStrength) {
  if (!getSettings().haptic) return
  // 우선순위: Toss 인앱 > Capacitor 네이티브(iOS/Android) > 웹 fallback
  if (isInToss()) {
    generateHapticFeedback({ type: TOSS_MAP[strength] }).catch(() => {/* 무시 */})
    return
  }
  if (Capacitor.isNativePlatform()) {
    capacitorHaptic(strength)
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
