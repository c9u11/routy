export type RoundRating = 'EXCELLENT' | 'GOOD' | 'CLEAR'

export function calcScore(pathLength: number): number {
  // pathLength = total nodes in path including START and DESTINATION
  // waypoints = intermediate nodes only
  const waypoints = Math.max(0, pathLength - 2)
  return waypoints * waypoints
}

const SPEED_TIME_CONFIG = [
  { initial: 18, bonus: 4 },   // Lv1
  { initial: 13, bonus: 3 },   // Lv2
  { initial: 10, bonus: 2.5 }, // Lv3
  { initial: 8, bonus: 2 },    // Lv4
  { initial: 7, bonus: 1.5 },  // Lv5
]

export function getSpeedTimeConfig(level: number) {
  return SPEED_TIME_CONFIG[Math.min(level - 1, SPEED_TIME_CONFIG.length - 1)]
}

export function getSpeedLevel(turn: number): number {
  if (turn >= 12) return 5
  if (turn >= 8) return 4
  if (turn >= 5) return 3
  if (turn >= 2) return 2
  return 1
}

export function getSpeedGridSize(level: number): number {
  if (level >= 5) return 6
  if (level >= 3) return 5
  if (level >= 2) return 4
  return 3
}

// 레벨별 장애물 밀도 (그리드 면적 대비 비율). gridGenerator가 size² 곱해 개수 산출.
export function getSpeedObstacleRatio(level: number): number {
  if (level >= 5) return 0.4   // 6×6 → 14
  if (level >= 4) return 0.45  // 5×5 → 11 (12 free)
  if (level >= 3) return 0.35  // 5×5 → 8
  if (level >= 2) return 0.25  // 4×4 → 4
  return 0
}

// 웨이포인트 비례 보너스: 매 턴마다 단가가 더 빠르게 감소
export function calcSpeedBonus(waypoints: number, turn: number, level: number): number {
  const rate = Math.max(0.25, 2.0 - turn * 0.12)
  const raw = waypoints * rate
  return Math.min(raw, getSpeedTimeConfig(level).initial)
}

export function getInfinityGridSize(score: number): number {
  if (score >= 8000) return 8
  if (score >= 6000) return 7
  if (score >= 4000) return 6
  if (score >= 2000) return 5
  return 4
}

// 인피니티 모드 라운드당 장애물 추가 수. 적절한 누적 곡선.
// 게임 오버의 주된 동인은 목숨 시스템이며, 장애물은 후반 압박 강화 역할.
export function getInfinityObstacleCount(turn: number, gridSize: number): number {
  const sizeBase = Math.max(1, Math.floor(gridSize / 3)) // 4×4=1, 5×5=1, 6×6=2, 7×7=2, 8×8=2
  const turnBoost = Math.floor(turn / 4)                 // 매 4턴마다 +1
  return sizeBase + turnBoost
}

// 라운드 평가: 최장 경로 대비 사용자 경로의 waypoint 차이
export function calcRoundRating(waypoints: number, optimal: number): RoundRating {
  if (waypoints >= optimal) return 'EXCELLENT'
  if (waypoints >= optimal - 2) return 'GOOD'
  return 'CLEAR'
}

export function applyRatingBonus(basePoints: number, rating: RoundRating): number {
  return rating === 'EXCELLENT' ? Math.round(basePoints * 1.5) : basePoints
}
