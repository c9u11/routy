import type { NodeData } from '../types/game'

export function parseId(id: string): [number, number] {
  const [r, c] = id.split('-').map(Number)
  return [r, c]
}

export function makeId(row: number, col: number): string {
  return `${row}-${col}`
}

export function getAdjacent(id: string, gridSize: number): string[] {
  const [r, c] = parseId(id)
  const candidates: [number, number][] = [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ]
  return candidates
    .filter(([nr, nc]) => nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize)
    .map(([nr, nc]) => makeId(nr, nc))
}

// S→D 최장 경로의 waypoints 수(=path length - 2)를 반환.
// 게임 규칙 반영: trigger 셀을 거치면 해당 obstacle도 통과 가능 노드가 됨.
// DFS 상태에 triggered set을 함께 추적해 trigger를 거친 뒤에는 그 obstacle을 지나갈 수 있도록 함.
// 큰 그리드(7×7, 8×8) + trigger 상태 폭증 방지를 위해 iteration cap. 한도 도달 시 lower bound 반환.
const LONGEST_PATH_MAX_ITER = 200_000

export function findLongestPathWaypoints(matrix: NodeData[][], startId: string, destId: string): number {
  const gridSize = matrix.length

  // triggerId → obstacleId 매핑 구축
  const triggerToObstacle = new Map<string, string>()
  for (const row of matrix) {
    for (const node of row) {
      if (node.type !== 'OBSTACLE' || !node.breakDirection) continue
      const [r, c] = node.id.split('-').map(Number)
      let tr = r, tc = c
      if (node.breakDirection === 'UP') tr--
      else if (node.breakDirection === 'DOWN') tr++
      else if (node.breakDirection === 'LEFT') tc--
      else if (node.breakDirection === 'RIGHT') tc++
      if (tr < 0 || tr >= gridSize || tc < 0 || tc >= gridSize) continue
      triggerToObstacle.set(makeId(tr, tc), node.id)
    }
  }

  const visited = new Set<string>([startId])
  const triggered = new Set<string>()
  let longest = 0
  let iterations = 0
  let capped = false

  function dfs(current: string, length: number) {
    if (capped) return
    if (++iterations > LONGEST_PATH_MAX_ITER) {
      capped = true
      return
    }
    if (current === destId) {
      if (length > longest) longest = length
      return
    }
    for (const neighbor of getAdjacent(current, gridSize)) {
      if (visited.has(neighbor)) continue
      const [nr, nc] = neighbor.split('-').map(Number)
      const node = matrix[nr][nc]
      // OBSTACLE은 triggered set에 포함되어 있어야 통과 가능
      if (node.type === 'OBSTACLE' && !triggered.has(neighbor)) continue

      const obsToTrigger = triggerToObstacle.get(neighbor)
      const newlyTriggered = obsToTrigger && !triggered.has(obsToTrigger) ? obsToTrigger : null

      visited.add(neighbor)
      if (newlyTriggered) triggered.add(newlyTriggered)
      dfs(neighbor, length + 1)
      visited.delete(neighbor)
      if (newlyTriggered) triggered.delete(newlyTriggered)

      if (capped) return
    }
  }

  dfs(startId, 1)
  return Math.max(0, longest - 2)
}

// S→D 최단 경로의 edge 수 반환. 도달 불가 시 null.
export function shortestPathLength(matrix: NodeData[][], startId: string, destId: string): number | null {
  const gridSize = matrix.length
  const obstacleSet = new Set<string>()
  matrix.forEach(row => row.forEach(node => {
    if (node.type === 'OBSTACLE') obstacleSet.add(node.id)
  }))

  if (startId === destId) return 0

  const queue: Array<[string, number]> = [[startId, 0]]
  const visited = new Set([startId])

  while (queue.length > 0) {
    const [current, dist] = queue.shift()!
    for (const neighbor of getAdjacent(current, gridSize)) {
      if (visited.has(neighbor) || obstacleSet.has(neighbor)) continue
      if (neighbor === destId) return dist + 1
      visited.add(neighbor)
      queue.push([neighbor, dist + 1])
    }
  }
  return null
}

export function hasPath(matrix: NodeData[][], startId: string, destId: string): boolean {
  return shortestPathLength(matrix, startId, destId) !== null
}
