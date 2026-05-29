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

// S→D 사이 OBSTACLE을 피하는 최장 단순 경로의 waypoints 수(=path length - 2)를 반환.
// DFS+백트래킹 — 큰 그리드(7×7, 8×8)에서 폭주 방지를 위해 iteration cap.
// 한도 도달 시 그 시점까지 찾은 best를 lower bound로 반환 (rating 용도엔 충분).
const LONGEST_PATH_MAX_ITER = 200_000

export function findLongestPathWaypoints(matrix: NodeData[][], startId: string, destId: string): number {
  const gridSize = matrix.length
  const obstacleSet = new Set<string>()
  matrix.forEach(row => row.forEach(node => {
    if (node.type === 'OBSTACLE') obstacleSet.add(node.id)
  }))

  const visited = new Set<string>([startId])
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
      if (visited.has(neighbor) || obstacleSet.has(neighbor)) continue
      visited.add(neighbor)
      dfs(neighbor, length + 1)
      visited.delete(neighbor)
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
