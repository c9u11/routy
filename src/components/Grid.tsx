import { useRef, useCallback } from 'react'
import type { NodeData } from '../types/game'
import NodeCell from './Node'

interface Props {
  matrix: NodeData[][]
  currentPath: string[]
  gridSize: number
  onAddNode: (id: string) => void
  onConfirm: () => void
  onCancel: () => void
  disabled?: boolean
}

const GAP = 10

function getNodeSize(gridSize: number): number {
  const maxWidth = Math.min(window.innerWidth - 48, 400)
  return Math.floor((maxWidth - GAP * (gridSize - 1)) / gridSize)
}

function getNodeFromPoint(
  containerRef: React.RefObject<HTMLDivElement | null>,
  x: number,
  y: number,
  gridSize: number,
  nodeSize: number
): string | null {
  const rect = containerRef.current?.getBoundingClientRect()
  if (!rect) return null
  const relX = x - rect.left
  const relY = y - rect.top
  const col = Math.floor(relX / (nodeSize + GAP))
  const row = Math.floor(relY / (nodeSize + GAP))
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null
  const cx = col * (nodeSize + GAP) + nodeSize / 2
  const cy = row * (nodeSize + GAP) + nodeSize / 2
  const dist = Math.sqrt((relX - cx) ** 2 + (relY - cy) ** 2)
  if (dist > nodeSize * 0.65) return null
  return `${row}-${col}`
}

export default function Grid({ matrix, currentPath, gridSize, onAddNode, onConfirm, onCancel, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const nodeSize = getNodeSize(gridSize)
  const totalSize = nodeSize * gridSize + GAP * (gridSize - 1)

  // SVG path points
  const pathPoints = currentPath.map(id => {
    const [r, c] = id.split('-').map(Number)
    const x = c * (nodeSize + GAP) + nodeSize / 2
    const y = r * (nodeSize + GAP) + nodeSize / 2
    return `${x},${y}`
  }).join(' ')

  const tryStart = useCallback((x: number, y: number) => {
    if (disabled) return false
    const nodeId = getNodeFromPoint(containerRef, x, y, gridSize, nodeSize)
    const startId = matrix.flatMap(r => r).find(n => n.type === 'START')?.id
    if (nodeId && nodeId === startId) {
      isDragging.current = true
      return true
    }
    return false
  }, [disabled, gridSize, nodeSize, matrix])

  const tryMove = useCallback((x: number, y: number) => {
    if (!isDragging.current || disabled) return
    const nodeId = getNodeFromPoint(containerRef, x, y, gridSize, nodeSize)
    if (nodeId) onAddNode(nodeId)
  }, [disabled, gridSize, nodeSize, onAddNode])

  const endDrag = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    onConfirm()
  }, [onConfirm])

  const cancelDrag = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false
      onCancel()
    }
  }, [onCancel])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (tryStart(e.clientX, e.clientY)) {
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    }
  }, [tryStart])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    tryMove(e.clientX, e.clientY)
  }, [tryMove])

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    if (!t) return
    if (tryStart(t.clientX, t.clientY)) {
      e.preventDefault()
    }
  }, [tryStart])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const t = e.touches[0]
    if (!t) return
    e.preventDefault()
    tryMove(t.clientX, t.clientY)
  }, [tryMove])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={cancelDrag}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={endDrag}
      onTouchCancel={cancelDrag}
      style={{
        position: 'relative',
        width: totalSize,
        height: totalSize,
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'width 0.35s ease, height 0.35s ease',
      }}
    >
      {/* SVG path overlay */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
        width={totalSize}
        height={totalSize}
      >
        {currentPath.length > 1 && (
          <polyline
            points={pathPoints}
            fill="none"
            stroke="rgba(22,119,255,0.55)"
            strokeWidth={nodeSize * 0.35}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Grid nodes */}
      {matrix.map((row, r) =>
        row.map((node, c) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: c * (nodeSize + GAP),
              top: r * (nodeSize + GAP),
            }}
          >
            <NodeCell node={node} size={nodeSize} />
          </div>
        ))
      )}
    </div>
  )
}
