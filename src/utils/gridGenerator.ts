import type { NodeData, BreakDirection } from '../types/game'
import { makeId, hasPath, shortestPathLength, findLongestPathWaypoints } from './pathfinding'
import { getSpeedObstacleRatio, getInfinityObstacleCount } from './scoring'

const DIRECTIONS: BreakDirection[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']

function emptyMatrix(size: number): NodeData[][] {
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({
      id: makeId(r, c),
      type: 'DEFAULT' as const,
      isActive: false,
      isTrigger: false,
      isPendingRemoval: false,
    }))
  )
}

function randomPos(size: number): [number, number] {
  return [Math.floor(Math.random() * size), Math.floor(Math.random() * size)]
}

function randomPosExcluding(size: number, exclude: Set<string>): [number, number] {
  let pos: [number, number]
  do {
    pos = randomPos(size)
  } while (exclude.has(makeId(...pos)))
  return pos
}

function applyTriggerFlags(matrix: NodeData[][], size: number): void {
  // Reset all triggers
  matrix.forEach(row => row.forEach(n => { n.isTrigger = false }))

  matrix.forEach(row =>
    row.forEach(node => {
      if (node.type !== 'OBSTACLE' || !node.breakDirection) return
      const [r, c] = node.id.split('-').map(Number)
      let tr = r, tc = c
      if (node.breakDirection === 'UP') tr = r - 1
      else if (node.breakDirection === 'DOWN') tr = r + 1
      else if (node.breakDirection === 'LEFT') tc = c - 1
      else if (node.breakDirection === 'RIGHT') tc = c + 1

      if (tr >= 0 && tr < size && tc >= 0 && tc < size) {
        const target = matrix[tr][tc]
        if (target.type === 'DEFAULT') {
          target.isTrigger = true
        }
      }
    })
  )
}

export function generateInitialGrid(size: number): { matrix: NodeData[][]; startId: string; destId: string } {
  const matrix = emptyMatrix(size)
  const used = new Set<string>()

  const [sr, sc] = randomPos(size)
  const startId = makeId(sr, sc)
  used.add(startId)
  matrix[sr][sc].type = 'START'

  const [dr, dc] = randomPosExcluding(size, used)
  const destId = makeId(dr, dc)
  matrix[dr][dc].type = 'DESTINATION'

  return { matrix, startId, destId }
}

export function generateSpeedGrid(
  size: number,
  level: number,
  prevDestId: string | null
): { matrix: NodeData[][]; startId: string; destId: string; optimalWaypoints: number } {
  const matrix = emptyMatrix(size)
  const used = new Set<string>()

  let startId: string
  if (prevDestId) {
    const [pr, pc] = prevDestId.split('-').map(Number)
    if (pr < size && pc < size) {
      startId = prevDestId
      matrix[pr][pc].type = 'START'
      used.add(prevDestId)
    } else {
      const [sr, sc] = randomPos(size)
      startId = makeId(sr, sc)
      matrix[sr][sc].type = 'START'
      used.add(startId)
    }
  } else {
    const [sr, sc] = randomPos(size)
    startId = makeId(sr, sc)
    matrix[sr][sc].type = 'START'
    used.add(startId)
  }

  const [dr, dc] = randomPosExcluding(size, used)
  const destId = makeId(dr, dc)
  matrix[dr][dc].type = 'DESTINATION'
  used.add(destId)

  // Level 2+: add obstacles (speed mode obstacles don't have breakDirection — they reset each round)
  const ratio = getSpeedObstacleRatio(level)
  if (ratio > 0) {
    const obstacleCount = Math.floor(size * size * ratio)
    let added = 0
    let attempts = 0
    while (added < obstacleCount && attempts < 300) {
      attempts++
      const [or, oc] = randomPosExcluding(size, used)
      const oid = makeId(or, oc)
      matrix[or][oc].type = 'OBSTACLE'
      used.add(oid)
      if (!hasPath(matrix, startId, destId)) {
        matrix[or][oc].type = 'DEFAULT'
        used.delete(oid)
      } else {
        added++
      }
    }
  }

  const optimalWaypoints = findLongestPathWaypoints(matrix, startId, destId)
  return { matrix, startId, destId, optimalWaypoints }
}

export function addObstaclesInfinity(
  matrix: NodeData[][],
  startId: string,
  destId: string,
  gridSize: number,
  turn: number
): NodeData[][] {
  const newMatrix = matrix.map(row => row.map(n => ({ ...n })))
  const used = new Set(
    newMatrix.flatMap(row =>
      row.filter(n => n.type !== 'DEFAULT').map(n => n.id)
    )
  )

  const count = getInfinityObstacleCount(turn, gridSize)

  let added = 0
  let attempts = 0
  while (added < count && attempts < 300) {
    attempts++
    const [or, oc] = randomPosExcluding(gridSize, used)
    const oid = makeId(or, oc)
    newMatrix[or][oc].type = 'OBSTACLE'
    used.add(oid)

    if (!hasPath(newMatrix, startId, destId)) {
      newMatrix[or][oc].type = 'DEFAULT'
      used.delete(oid)
      continue
    }

    // 트리거 셀이 (1) DEFAULT이고 (2) 이 obstacle을 벽으로 둔 상태에서 S에서 도달 가능해야 함
    const dirCandidates: { dir: BreakDirection; tr: number; tc: number }[] = []
    for (const dir of DIRECTIONS) {
      let tr = or, tc = oc
      if (dir === 'UP') tr--
      else if (dir === 'DOWN') tr++
      else if (dir === 'LEFT') tc--
      else if (dir === 'RIGHT') tc++
      if (tr < 0 || tr >= gridSize || tc < 0 || tc >= gridSize) continue
      if (used.has(makeId(tr, tc))) continue
      dirCandidates.push({ dir, tr, tc })
    }
    // 도달 가능 방향만 추림 (현재 obstacle 포함한 상태에서 S→trigger 가능?)
    const reachable = dirCandidates.filter(({ tr, tc }) =>
      hasPath(newMatrix, startId, makeId(tr, tc))
    )

    if (reachable.length === 0) {
      newMatrix[or][oc].type = 'DEFAULT'
      used.delete(oid)
      continue
    }

    const chosen = reachable[Math.floor(Math.random() * reachable.length)]
    newMatrix[or][oc].breakDirection = chosen.dir

    // 이 obstacle 배치로 인해 기존 obstacle 중 트리거가 도달 불가해진 게 있으면 revert
    if (!allTriggersReachable(newMatrix, startId)) {
      newMatrix[or][oc].type = 'DEFAULT'
      newMatrix[or][oc].breakDirection = undefined
      used.delete(oid)
      continue
    }

    added++
  }

  applyTriggerFlags(newMatrix, gridSize)
  return newMatrix
}

// 격자 내 모든 OBSTACLE의 trigger 셀이 S에서 도달 가능한지 확인.
// obstacle은 벽으로 취급되므로 trigger를 거쳐야 obstacle 통과 가능 — 도달 불가하면 영구 잔존.
function allTriggersReachable(matrix: NodeData[][], startId: string): boolean {
  const size = matrix.length
  for (const row of matrix) {
    for (const node of row) {
      if (node.type !== 'OBSTACLE' || !node.breakDirection) continue
      const [r, c] = node.id.split('-').map(Number)
      let tr = r, tc = c
      if (node.breakDirection === 'UP') tr--
      else if (node.breakDirection === 'DOWN') tr++
      else if (node.breakDirection === 'LEFT') tc--
      else if (node.breakDirection === 'RIGHT') tc++
      if (tr < 0 || tr >= size || tc < 0 || tc >= size) return false
      if (!hasPath(matrix, startId, makeId(tr, tc))) return false
    }
  }
  return true
}

export function relocateDestination(
  matrix: NodeData[][],
  startId: string,
  oldDestId: string,
  gridSize: number
): { matrix: NodeData[][]; destId: string } {
  const newMatrix = matrix.map(row => row.map(n => ({ ...n })))

  // Clear old destination
  const [odr, odc] = oldDestId.split('-').map(Number)
  newMatrix[odr][odc].type = 'DEFAULT'

  const used = new Set(
    newMatrix.flatMap(row =>
      row.filter(n => n.type !== 'DEFAULT').map(n => n.id)
    )
  )
  used.add(startId)

  let newDestId: string
  let attempts = 0
  do {
    const [dr, dc] = randomPosExcluding(gridSize, used)
    newDestId = makeId(dr, dc)
    const [dr2, dc2] = newDestId.split('-').map(Number)
    newMatrix[dr2][dc2].type = 'DESTINATION'
    attempts++
    if (hasPath(newMatrix, startId, newDestId)) break
    newMatrix[dr2][dc2].type = 'DEFAULT'
  } while (attempts < 200)

  applyTriggerFlags(newMatrix, gridSize)
  return { matrix: newMatrix, destId: newDestId }
}

export function expandGrid(oldMatrix: NodeData[][], newSize: number): NodeData[][] {
  const newMatrix = emptyMatrix(newSize)
  oldMatrix.forEach(row =>
    row.forEach(node => {
      const [r, c] = node.id.split('-').map(Number)
      newMatrix[r][c] = { ...node }
    })
  )
  applyTriggerFlags(newMatrix, newSize)
  return newMatrix
}

export function placeNewDestination(
  matrix: NodeData[][],
  startId: string,
  gridSize: number,
): { matrix: NodeData[][]; destId: string } {
  const newMatrix = matrix.map(row => row.map(n => ({ ...n })))
  const used = new Set(
    newMatrix.flatMap(row => row.filter(n => n.type !== 'DEFAULT').map(n => n.id))
  )

  // 가능한 모든 빈 칸을 셔플 후 순회 — 최단 거리 큰 위치를 우선 시도
  const candidates: { id: string; dist: number }[] = []
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const id = makeId(r, c)
      if (used.has(id)) continue
      const [dr, dc] = [r, c]
      newMatrix[dr][dc].type = 'DESTINATION'
      const dist = shortestPathLength(newMatrix, startId, id)
      newMatrix[dr][dc].type = 'DEFAULT'
      if (dist !== null) candidates.push({ id, dist })
    }
  }

  // 셔플 후 거리 내림차순 정렬 → 가장 먼 후보 선택 (같은 거리는 랜덤)
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  candidates.sort((a, b) => b.dist - a.dist)

  let destId = ''
  if (candidates.length > 0) {
    destId = candidates[0].id
    const [dr, dc] = destId.split('-').map(Number)
    newMatrix[dr][dc].type = 'DESTINATION'
  }

  applyTriggerFlags(newMatrix, gridSize)
  return { matrix: newMatrix, destId }
}

export function processPathObstacles(
  matrix: NodeData[][],
  path: string[],
  gridSize: number
): NodeData[][] {
  const pathSet = new Set(path)
  const newMatrix = matrix.map(row => row.map(n => ({ ...n })))

  // Find obstacles whose trigger nodes are in the path
  newMatrix.forEach(row =>
    row.forEach(node => {
      if (node.type !== 'OBSTACLE' || !node.breakDirection) return
      const [r, c] = node.id.split('-').map(Number)
      let tr = r, tc = c
      if (node.breakDirection === 'UP') tr = r - 1
      else if (node.breakDirection === 'DOWN') tr = r + 1
      else if (node.breakDirection === 'LEFT') tc = c - 1
      else if (node.breakDirection === 'RIGHT') tc = c + 1

      const triggerId = makeId(tr, tc)
      if (pathSet.has(triggerId)) {
        newMatrix[r][c].type = 'DEFAULT'
        newMatrix[r][c].breakDirection = undefined
        newMatrix[r][c].isPendingRemoval = false
      }
    })
  )

  applyTriggerFlags(newMatrix, gridSize)
  return newMatrix
}

// 현재 드래그 경로 기준으로 방해물 isPendingRemoval 플래그 갱신.
// 트리거 노드가 경로에 있으면 true, 경로가 줄거나 없으면 false로 복원.
export function updatePendingRemovals(matrix: NodeData[][], currentPath: string[]): NodeData[][] {
  const pathSet = new Set(currentPath)
  return matrix.map(row =>
    row.map(node => {
      if (node.type !== 'OBSTACLE' || !node.breakDirection) {
        return node.isPendingRemoval ? { ...node, isPendingRemoval: false } : node
      }
      const [r, c] = node.id.split('-').map(Number)
      let tr = r, tc = c
      if (node.breakDirection === 'UP') tr--
      else if (node.breakDirection === 'DOWN') tr++
      else if (node.breakDirection === 'LEFT') tc--
      else if (node.breakDirection === 'RIGHT') tc++
      const pending = pathSet.has(makeId(tr, tc))
      return pending !== node.isPendingRemoval ? { ...node, isPendingRemoval: pending } : node
    })
  )
}
