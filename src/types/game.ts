export type NodeType = 'DEFAULT' | 'OBSTACLE' | 'START' | 'DESTINATION'
export type BreakDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type GameMode = 'SPEED' | 'INFINITY'
export type Screen = 'HOME' | 'GAME' | 'GAME_OVER' | 'TUTORIAL'

export interface NodeData {
  id: string
  type: NodeType
  breakDirection?: BreakDirection
  isActive: boolean
  isTrigger: boolean
  isPendingRemoval: boolean // OBSTACLE 전용: 트리거가 현재 경로에 있을 때 true (확정 제거 전 임시 상태)
}

export type RoundRating = 'EXCELLENT' | 'GOOD' | 'CLEAR'

export interface RoundRatingInfo {
  tier: RoundRating
  basePoints: number
  bonus: number  // tier === 'EXCELLENT'일 때만 > 0
  key: number    // 매 라운드마다 증가 — toast 재마운트 트리거
}

export interface GameState {
  gameMode: GameMode
  gridSize: number
  score: number
  bestScore: number
  level: number
  timeRemaining: number
  turn: number
  matrix: NodeData[][]
  currentPath: string[]
  isGameOver: boolean
  optimalWaypoints?: number  // 현재 라운드 최장 경로 (Speed/Infinity 모드)
  lastRoundRating?: RoundRatingInfo  // 마지막 클리어 라운드 평가
  lives?: number             // INFINITY 모드 전용. 초기 3.
  lastLifeDelta?: number     // 직전 라운드 차감량 (toast 표시용, 0/-1/-3)
}
