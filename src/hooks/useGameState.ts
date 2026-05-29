import { useReducer, useEffect, useRef, useCallback } from 'react'
import type { GameState, GameMode } from '../types/game'
import {
  generateInitialGrid,
  generateSpeedGrid,
  addObstaclesInfinity,
  expandGrid,
  placeNewDestination,
  processPathObstacles,
  updatePendingRemovals,
} from '../utils/gridGenerator'
import { hasPath, findLongestPathWaypoints } from '../utils/pathfinding'
import {
  calcScore,
  calcSpeedBonus,
  getSpeedTimeConfig,
  getSpeedLevel,
  getSpeedGridSize,
  getInfinityGridSize,
  calcRoundRating,
  applyRatingBonus,
} from '../utils/scoring'
import { vibrateNode, vibrateDestination, vibrateGameOver } from '../utils/haptic'
import { shake } from '../utils/feedback'

type Action =
  | { type: 'START_GAME'; gameMode: GameMode }
  | { type: 'PATH_ADD_NODE'; nodeId: string }
  | { type: 'PATH_CONFIRM' }
  | { type: 'PATH_CANCEL' }
  | { type: 'TICK' }
  | { type: 'RESTART' }

function getBestScore(mode: GameMode): number {
  return parseInt(localStorage.getItem(`best_${mode}`) ?? '0', 10)
}

function setBestScore(mode: GameMode, score: number) {
  const current = getBestScore(mode)
  if (score > current) localStorage.setItem(`best_${mode}`, String(score))
}

function buildInitialState(gameMode: GameMode): GameState {
  const gridSize = gameMode === 'SPEED' ? 3 : 4
  const { matrix, startId } = generateInitialGrid(gridSize)
  const timeConfig = getSpeedTimeConfig(1)
  return {
    gameMode,
    gridSize,
    score: 0,
    bestScore: getBestScore(gameMode),
    level: 1,
    timeRemaining: gameMode === 'SPEED' ? timeConfig.initial : 0,
    turn: 0,
    matrix,
    currentPath: [startId],
    isGameOver: false,
  }
}

function buildSpeedStart(gameMode: GameMode): GameState {
  const gridSize = 3
  const { matrix, startId, optimalWaypoints } = generateSpeedGrid(gridSize, 1, null)
  const timeConfig = getSpeedTimeConfig(1)
  return {
    gameMode,
    gridSize,
    score: 0,
    bestScore: getBestScore(gameMode),
    level: 1,
    timeRemaining: timeConfig.initial,
    turn: 0,
    matrix,
    currentPath: [startId],
    isGameOver: false,
    optimalWaypoints,
  }
}

const INFINITY_INITIAL_LIVES = 3

function buildInfinityStart(gameMode: GameMode): GameState {
  const gridSize = 4
  const { matrix, startId, destId } = generateInitialGrid(gridSize)
  const optimalWaypoints = findLongestPathWaypoints(matrix, startId, destId)
  return {
    gameMode,
    gridSize,
    score: 0,
    bestScore: getBestScore(gameMode),
    level: 1,
    timeRemaining: 0,
    turn: 0,
    matrix,
    currentPath: [startId],
    isGameOver: false,
    optimalWaypoints,
    lives: INFINITY_INITIAL_LIVES,
  }
}

function findNodeId(matrix: GameState['matrix'], type: 'START' | 'DESTINATION'): string {
  for (const row of matrix) {
    for (const node of row) {
      if (node.type === type) return node.id
    }
  }
  return ''
}

function activatePath(matrix: GameState['matrix'], path: string[]): GameState['matrix'] {
  const pathSet = new Set(path)
  return matrix.map(row =>
    row.map(node => ({ ...node, isActive: pathSet.has(node.id) }))
  )
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME': {
      if (action.gameMode === 'SPEED') return buildSpeedStart(action.gameMode)
      return buildInfinityStart(action.gameMode)
    }

    case 'RESTART': {
      if (state.gameMode === 'SPEED') return buildSpeedStart(state.gameMode)
      return buildInfinityStart(state.gameMode)
    }

    case 'PATH_ADD_NODE': {
      const { nodeId } = action
      const path = state.currentPath
      if (path.length === 0) return state

      const lastNode = path[path.length - 1]
      if (path.includes(nodeId)) {
        // Backtrack: allow stepping back to the immediately previous node
        const idx = path.indexOf(nodeId)
        if (idx === path.length - 2) {
          const newPath = path.slice(0, idx + 1)
          // 경로가 줄었으므로 pending 상태 재계산 (백트래킹 시 방해물 복원)
          const matrixWithPending = updatePendingRemovals(state.matrix, newPath)
          const newMatrix = activatePath(matrixWithPending, newPath)
          return { ...state, matrix: newMatrix, currentPath: newPath }
        }
        return state
      }

      // Check adjacency (4-directional)
      const [lr, lc] = lastNode.split('-').map(Number)
      const [nr, nc] = nodeId.split('-').map(Number)
      if (Math.abs(lr - nr) + Math.abs(lc - nc) !== 1) return state

      const [tr, tc] = nodeId.split('-').map(Number)
      const targetNode = state.matrix[tr][tc]
      // OBSTACLE은 트리거를 이미 통과해 pendingRemoval=true인 경우에만 통과 가능
      if (targetNode.type === 'OBSTACLE' && !targetNode.isPendingRemoval) return state

      vibrateNode()

      const newPath = [...path, nodeId]

      // 트리거 노드 통과 시 방해물을 임시(pending) 상태로 표시 — 경로 확정 전까지 영구 제거 안 함
      const matrixWithPending = updatePendingRemovals(state.matrix, newPath)
      const newMatrix = activatePath(matrixWithPending, newPath)

      // 도착지 진입 시 즉시 자동 라운드 전환 (손 안 떼도 됨)
      if (targetNode.type === 'DESTINATION') {
        vibrateDestination()
        shake('medium')
        return reducer(
          { ...state, matrix: newMatrix, currentPath: newPath },
          { type: 'PATH_CONFIRM' }
        )
      }

      return { ...state, matrix: newMatrix, currentPath: newPath }
    }

    case 'PATH_CONFIRM': {
      const path = state.currentPath
      if (path.length < 2) {
        const cleared = state.matrix.map(row => row.map(n => ({ ...n, isActive: false })))
        const startId = findNodeId(state.matrix, 'START')
        return { ...state, matrix: cleared, currentPath: [startId] }
      }

      const lastId = path[path.length - 1]
      const [lastR, lastC] = lastId.split('-').map(Number)
      const lastNode = state.matrix[lastR][lastC]

      if (lastNode.type !== 'DESTINATION') {
        // Not at destination — cancel path
        const cleared = state.matrix.map(row => row.map(n => ({ ...n, isActive: false })))
        const startId = findNodeId(state.matrix, 'START')
        return { ...state, matrix: cleared, currentPath: [startId] }
      }

      // vibrateDestination is called in PATH_ADD_NODE before this — no double call here

      const basePoints = calcScore(path.length)

      // ----- SPEED MODE -----
      if (state.gameMode === 'SPEED') {
        const waypoints = path.length - 2
        const optimal = state.optimalWaypoints ?? waypoints
        const rating = calcRoundRating(waypoints, optimal)
        const earnedPoints = applyRatingBonus(basePoints, rating)
        const newScore = state.score + earnedPoints

        const newTurn = state.turn + 1
        const newLevel = getSpeedLevel(newTurn)
        const newGridSize = getSpeedGridSize(newLevel)
        const timeConfig = getSpeedTimeConfig(newLevel)
        // 웨이포인트 비례 보너스: 0 웨이포인트 = 0초, 매 턴 단가 감소
        const earnedTime = calcSpeedBonus(waypoints, state.turn, newLevel)
        // 시간 상한 = 해당 레벨의 초기 시간 (2배 누적 제거)
        const newTime = Math.min(state.timeRemaining + earnedTime, timeConfig.initial)

        const { matrix: newMatrix, startId: newStartId, optimalWaypoints: newOptimal } =
          generateSpeedGrid(newGridSize, newLevel, lastId)
        const newBest = Math.max(newScore, state.bestScore)
        setBestScore(state.gameMode, newScore)

        return {
          ...state,
          score: newScore,
          bestScore: newBest,
          level: newLevel,
          gridSize: newGridSize,
          timeRemaining: newTime,
          matrix: newMatrix,
          currentPath: [newStartId],
          turn: newTurn,
          optimalWaypoints: newOptimal,
          lastRoundRating: {
            tier: rating,
            basePoints,
            bonus: earnedPoints - basePoints,
            key: (state.lastRoundRating?.key ?? 0) + 1,
          },
        }
      }

      // ----- INFINITY MODE -----
      const infWaypoints = path.length - 2
      const infOptimal = state.optimalWaypoints ?? infWaypoints
      const infRating = calcRoundRating(infWaypoints, infOptimal)
      const earnedPoints = applyRatingBonus(basePoints, infRating)
      const newScore = state.score + earnedPoints
      const ratingInfo = {
        tier: infRating,
        basePoints,
        bonus: earnedPoints - basePoints,
        key: (state.lastRoundRating?.key ?? 0) + 1,
      }

      // 목숨 차감: Excellent ±0 / Good -1 / Clear -3
      const lifeDelta = infRating === 'EXCELLENT' ? 0 : infRating === 'GOOD' ? -1 : -3
      const newLives = (state.lives ?? INFINITY_INITIAL_LIVES) + lifeDelta

      const newBestScore = Math.max(newScore, state.bestScore)
      setBestScore(state.gameMode, newScore)

      // 목숨 소진 → 즉시 게임오버
      if (newLives <= 0) {
        vibrateGameOver()
        shake('heavy')
        return {
          ...state,
          score: newScore,
          bestScore: newBestScore,
          matrix: state.matrix.map(row => row.map(n => ({ ...n, isActive: false }))),
          isGameOver: true,
          lastRoundRating: ratingInfo,
          lives: 0,
          lastLifeDelta: lifeDelta,
        }
      }

      const newTargetGridSize = getInfinityGridSize(newScore)
      let workMatrix = state.matrix.map(row => row.map(n => ({ ...n, isActive: false })))

      // Obstacle removal already happened incrementally in PATH_ADD_NODE;
      // run once more as safety net for any stragglers
      workMatrix = processPathObstacles(workMatrix, path, state.gridSize)

      // Move start to old destination (lastId)
      const oldStartId = findNodeId(workMatrix, 'START')
      const [osr, osc] = oldStartId.split('-').map(Number)
      workMatrix[osr][osc].type = 'DEFAULT'
      const [lpr, lpc] = lastId.split('-').map(Number)
      workMatrix[lpr][lpc].type = 'START'
      const newStartId = lastId

      // Expand grid if needed
      let workGridSize = state.gridSize
      if (newTargetGridSize > state.gridSize) {
        workGridSize = newTargetGridSize
        workMatrix = expandGrid(workMatrix, workGridSize)
      }

      // Place new destination — 가능한 가장 먼 빈 칸에 배치
      const { matrix: withDest, destId: newDestId } =
        placeNewDestination(workMatrix, newStartId, workGridSize)
      workMatrix = withDest

      // 극단적 케이스: D 둘 자리조차 없으면 즉시 게임오버 (이론상 거의 발생 X)
      if (!newDestId) {
        vibrateGameOver()
        shake('heavy')
        return {
          ...state,
          score: newScore,
          bestScore: newBestScore,
          matrix: workMatrix,
          isGameOver: true,
          lastRoundRating: ratingInfo,
          lives: newLives,
          lastLifeDelta: lifeDelta,
        }
      }

      // Add obstacles — 턴이 늘수록 더 많은 장애물 추가
      workMatrix = addObstaclesInfinity(workMatrix, newStartId, newDestId, workGridSize, state.turn + 1)

      // 보호망: 격자가 막혀 D 도달 불가능 → 게임오버
      const gridlocked = !hasPath(workMatrix, newStartId, newDestId)
      if (gridlocked) {
        vibrateGameOver()
        shake('heavy')
        return {
          ...state,
          score: newScore,
          bestScore: newBestScore,
          matrix: workMatrix,
          isGameOver: true,
          lastRoundRating: ratingInfo,
          lives: newLives,
          lastLifeDelta: lifeDelta,
        }
      }

      const nextOptimal = findLongestPathWaypoints(workMatrix, newStartId, newDestId)

      return {
        ...state,
        score: newScore,
        bestScore: newBestScore,
        gridSize: workGridSize,
        turn: state.turn + 1,
        matrix: workMatrix,
        currentPath: [newStartId],
        optimalWaypoints: nextOptimal,
        lastRoundRating: ratingInfo,
        lives: newLives,
        lastLifeDelta: lifeDelta,
      }
    }

    case 'PATH_CANCEL': {
      const deactivated = state.matrix.map(row => row.map(n => ({ ...n, isActive: false })))
      const cleared = updatePendingRemovals(deactivated, []) // pending 플래그 전부 초기화
      const startId = findNodeId(state.matrix, 'START')
      return { ...state, matrix: cleared, currentPath: [startId] }
    }

    case 'TICK': {
      if (state.gameMode !== 'SPEED' || state.isGameOver) return state
      const newTime = state.timeRemaining - 0.1
      if (newTime <= 0) {
        vibrateGameOver()
        shake('heavy')
        setBestScore(state.gameMode, state.score)
        return {
          ...state,
          timeRemaining: 0,
          bestScore: Math.max(state.score, state.bestScore),
          isGameOver: true,
        }
      }
      return { ...state, timeRemaining: newTime }
    }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, null, () => buildInitialState('SPEED'))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startGame = useCallback((mode: GameMode) => {
    dispatch({ type: 'START_GAME', gameMode: mode })
  }, [])

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' })
  }, [])

  const addNodeToPath = useCallback((nodeId: string) => {
    dispatch({ type: 'PATH_ADD_NODE', nodeId })
  }, [])

  const confirmPath = useCallback(() => {
    dispatch({ type: 'PATH_CONFIRM' })
  }, [])

  const cancelPath = useCallback(() => {
    dispatch({ type: 'PATH_CANCEL' })
  }, [])

  // Speed mode timer
  useEffect(() => {
    if (state.gameMode !== 'SPEED' || state.isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 100)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state.gameMode, state.isGameOver])

  return { state, startGame, restart, addNodeToPath, confirmPath, cancelPath }
}
