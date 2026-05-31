import { useEffect, useState } from 'react'
import type { NodeData, BreakDirection, GameMode } from '../types/game'
import NodeCell from './Node'

// 입력 없이 시작→경유→도착으로 경로가 그려지는 데모 애니메이션. 모드별 격자 구성.

type Cell = [number, number]

interface DemoSpec {
  size: number
  start: Cell
  goal: Cell
  triggers: Cell[]
  obstacles: { pos: Cell; dir?: BreakDirection }[]
  path: Cell[]
}

const SPECS: Record<GameMode, DemoSpec> = {
  // 길게 돌아갈수록 고득점 — 9칸을 모두 거치는 winding path
  SPEED: {
    size: 3,
    start: [0, 0],
    goal: [2, 2],
    triggers: [],
    obstacles: [],
    path: [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1], [0, 2], [1, 2], [2, 2]],
  },
  // 최장 경로로 빙 돌아가며, 트리거(주황)를 지나 방해물(빨강)을 통과하는 시연
  INFINITY: {
    size: 4,
    start: [0, 0],
    goal: [3, 3],
    triggers: [[1, 2]],
    obstacles: [{ pos: [1, 1], dir: 'RIGHT' }],
    // 16칸 중 13칸을 거치는 winding path — (1,2)트리거 → (1,1)방해물 통과 포함
    path: [
      [0, 0], [0, 1], [0, 2], [0, 3],
      [1, 3], [1, 2], [1, 1], [1, 0],
      [2, 0], [2, 1], [2, 2], [2, 3],
      [3, 3],
    ],
  },
}

const GAP = 8

function id(r: number, c: number) {
  return `${r}-${c}`
}

function buildMatrix(spec: DemoSpec, activeIds: Set<string>, triggerPassed: boolean): NodeData[][] {
  const triggerSet = new Set(spec.triggers.map(([r, c]) => id(r, c)))
  const obstacleMap = new Map(spec.obstacles.map(o => [id(o.pos[0], o.pos[1]), o]))
  const startId = id(spec.start[0], spec.start[1])
  const goalId = id(spec.goal[0], spec.goal[1])

  return Array.from({ length: spec.size }, (_, r) =>
    Array.from({ length: spec.size }, (_, c) => {
      const nid = id(r, c)
      const obstacle = obstacleMap.get(nid)
      const base: NodeData = {
        id: nid,
        type: 'DEFAULT',
        isActive: activeIds.has(nid),
        isTrigger: triggerSet.has(nid),
        isPendingRemoval: false,
      }
      if (nid === startId) base.type = 'START'
      else if (nid === goalId) base.type = 'DESTINATION'
      else if (obstacle) {
        base.type = 'OBSTACLE'
        base.breakDirection = obstacle.dir
        // 트리거를 지난 뒤에는 통과 가능(pending) 상태로 열림
        base.isPendingRemoval = triggerPassed
      }
      return base
    })
  )
}

export default function TutorialDemo({ mode }: { mode: GameMode }) {
  const spec = SPECS[mode]
  const [step, setStep] = useState(1)

  // 경로를 한 칸씩 늘렸다가, 끝까지 차면 잠시 멈춘 뒤 리셋해 반복
  useEffect(() => {
    setStep(1)
    const HOLD = 3
    let s = 1
    const timer = setInterval(() => {
      s = s >= spec.path.length + HOLD ? 1 : s + 1
      setStep(s)
    }, 480)
    return () => clearInterval(timer)
  }, [mode, spec.path.length])

  const shown = Math.min(step, spec.path.length)
  const activePath = spec.path.slice(0, shown)
  const activeIds = new Set(activePath.map(([r, c]) => id(r, c)))
  const triggerPassed = spec.triggers.some(([r, c]) => activeIds.has(id(r, c)))
  const matrix = buildMatrix(spec, activeIds, triggerPassed)

  // 컨테이너 폭에 맞춰 노드 크기 산출 (최대 240px)
  const maxWidth = Math.min(240, spec.size * 56)
  const nodeSize = Math.floor((maxWidth - GAP * (spec.size - 1)) / spec.size)
  const total = nodeSize * spec.size + GAP * (spec.size - 1)

  const pts = activePath
    .map(([r, c]) => `${c * (nodeSize + GAP) + nodeSize / 2},${r * (nodeSize + GAP) + nodeSize / 2}`)
    .join(' ')

  const last = activePath[activePath.length - 1]
  const fingerX = last ? last[1] * (nodeSize + GAP) + nodeSize / 2 : 0
  const fingerY = last ? last[0] * (nodeSize + GAP) + nodeSize / 2 : 0

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
      <div style={{ position: 'relative', width: total, height: total }}>
        <svg
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
          width={total}
          height={total}
        >
          {activePath.length > 1 && (
            <polyline
              points={pts}
              fill="none"
              stroke="rgba(22,119,255,0.55)"
              strokeWidth={nodeSize * 0.32}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {matrix.map((row, r) =>
          row.map((node, c) => (
            <div key={node.id} style={{ position: 'absolute', left: c * (nodeSize + GAP), top: r * (nodeSize + GAP) }}>
              <NodeCell node={node} size={nodeSize} />
            </div>
          ))
        )}

        {/* 따라 움직이는 손가락 표시 */}
        {last && (
          <div
            style={{
              position: 'absolute',
              left: fingerX,
              top: fingerY,
              fontSize: nodeSize * 0.7,
              transform: 'translate(-10%, -10%)',
              transition: 'left 0.3s ease, top 0.3s ease',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
            }}
          >
            👆
          </div>
        )}
      </div>
    </div>
  )
}
