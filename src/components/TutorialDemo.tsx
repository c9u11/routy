import { useEffect, useState } from 'react'
import type { NodeData, BreakDirection, GameMode, RoundRating } from '../types/game'
import { useT } from '../i18n/strings'
import NodeCell from './Node'

// 입력 없이 경로가 그려지는 데모. Excellent → Good → Clear 평점 케이스를
// 차례로 한 번씩 시연하고 반복. 모드별 격자 구성.

type Cell = [number, number]

interface Variant {
  tier: RoundRating
  path: Cell[]
}

interface DemoSpec {
  size: number
  start: Cell
  goal: Cell
  triggers: Cell[]
  obstacles: { pos: Cell; dir?: BreakDirection }[]
  variants: Variant[]
}

const TIER_COLOR: Record<GameMode, Record<RoundRating, string>> = {
  SPEED: { EXCELLENT: '#fa8c16', GOOD: '#1677ff', CLEAR: '#8c8c8c' },
  INFINITY: { EXCELLENT: '#fa8c16', GOOD: '#1677ff', CLEAR: '#cf1322' },
}

const SPECS: Record<GameMode, DemoSpec> = {
  // 3×3, 최장 = 9칸(waypoint 7). 방해물/트리거 없음.
  SPEED: {
    size: 3,
    start: [0, 0],
    goal: [2, 2],
    triggers: [],
    obstacles: [],
    variants: [
      { tier: 'EXCELLENT', path: [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1], [0, 2], [1, 2], [2, 2]] }, // wp7
      { tier: 'GOOD', path: [[0, 0], [0, 1], [1, 1], [1, 0], [2, 0], [2, 1], [2, 2]] }, // wp5
      { tier: 'CLEAR', path: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] }, // wp3
    ],
  },
  // 4×4, 최장 = 15칸(waypoint 13). (0,1)트리거 → (1,1)방해물 통과.
  INFINITY: {
    size: 4,
    start: [0, 0],
    goal: [3, 3],
    triggers: [[0, 1]],
    obstacles: [{ pos: [1, 1], dir: 'UP' }],
    variants: [
      {
        tier: 'EXCELLENT',
        path: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [1, 2], [1, 1], [1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [2, 2], [2, 3], [3, 3]], // wp13
      },
      {
        tier: 'GOOD',
        path: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [1, 2], [1, 1], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [3, 3]], // wp11
      },
      {
        tier: 'CLEAR',
        path: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3]], // wp5, 방해물 우회
      },
    ],
  },
}

const GAP = 8
const STEP_MS = 250
const HOLD_TICKS = 3 // 경로 완성 후 멈춤(평점 강조)

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
        base.isPendingRemoval = triggerPassed
      }
      return base
    })
  )
}

export default function TutorialDemo({ mode }: { mode: GameMode }) {
  const t = useT()
  const spec = SPECS[mode]
  const [s, setS] = useState({ vi: 0, step: 1, hold: 0 })

  useEffect(() => {
    setS({ vi: 0, step: 1, hold: 0 })
    const timer = setInterval(() => {
      setS(prev => {
        const path = spec.variants[prev.vi].path
        if (prev.step < path.length) return { ...prev, step: prev.step + 1, hold: 0 }
        if (prev.hold < HOLD_TICKS) return { ...prev, hold: prev.hold + 1 }
        return { vi: (prev.vi + 1) % spec.variants.length, step: 1, hold: 0 }
      })
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [mode, spec])

  const variant = spec.variants[s.vi]
  const shown = Math.min(s.step, variant.path.length)
  const activePath = variant.path.slice(0, shown)
  const activeIds = new Set(activePath.map(([r, c]) => id(r, c)))
  const triggerPassed = spec.triggers.some(([r, c]) => activeIds.has(id(r, c)))
  const matrix = buildMatrix(spec, activeIds, triggerPassed)

  const maxWidth = Math.min(240, spec.size * 56)
  const nodeSize = Math.floor((maxWidth - GAP * (spec.size - 1)) / spec.size)
  const total = nodeSize * spec.size + GAP * (spec.size - 1)

  const pts = activePath
    .map(([r, c]) => `${c * (nodeSize + GAP) + nodeSize / 2},${r * (nodeSize + GAP) + nodeSize / 2}`)
    .join(' ')

  const last = activePath[activePath.length - 1]
  const fingerX = last ? last[1] * (nodeSize + GAP) + nodeSize / 2 : 0
  const fingerY = last ? last[0] * (nodeSize + GAP) + nodeSize / 2 : 0

  const tierLabel = (mode === 'INFINITY' ? t.toast.infinity : t.toast.speed)[variant.tier].label
  const tierColor = TIER_COLOR[mode][variant.tier]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      {/* 현재 시연 중인 평점 배지 */}
      <div
        style={{
          padding: '4px 14px',
          borderRadius: 99,
          background: tierColor,
          color: 'white',
          fontSize: 14,
          fontWeight: 800,
          transition: 'background 0.2s',
        }}
      >
        {tierLabel}
      </div>

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

        {last && (
          <div
            style={{
              position: 'absolute',
              left: fingerX,
              top: fingerY,
              fontSize: nodeSize * 0.7,
              transform: 'translate(-10%, -10%)',
              transition: 'left 0.18s ease, top 0.18s ease',
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
