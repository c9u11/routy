import type { NodeData } from '../types/game'

interface Props {
  node: NodeData
  size: number
}

const DIRECTION_ARROW: Record<string, string> = {
  UP: '↑',
  DOWN: '↓',
  LEFT: '←',
  RIGHT: '→',
}

export default function Node({ node, size }: Props) {
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: size * 0.28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'background 0.12s, box-shadow 0.12s',
    userSelect: 'none',
    cursor: 'pointer',
    fontSize: size * 0.32,
    fontWeight: 700,
  }

  if (node.type === 'OBSTACLE') {
    if (node.isPendingRemoval) {
      // 트리거 통과 중: 통과 가능 상태. active이면 path 라인이 위로 지나가는 효과
      const isActive = node.isActive
      return (
        <div
          style={{
            ...base,
            background: isActive ? 'rgba(22,119,255,0.55)' : 'rgba(255,77,79,0.25)',
            border: isActive ? '2px solid rgba(22,119,255,0.7)' : '2px dashed rgba(255,77,79,0.6)',
            boxShadow: isActive ? '0 0 0 4px rgba(22,119,255,0.35)' : 'none',
            transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
          }}
        >
          <span
            style={{
              fontSize: size * 0.28,
              color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,77,79,0.5)',
              fontWeight: 700,
            }}
          >
            {node.breakDirection ? DIRECTION_ARROW[node.breakDirection] : '✕'}
          </span>
        </div>
      )
    }
    return (
      <div
        style={{
          ...base,
          background: '#ff4d4f',
          boxShadow: 'none',
        }}
      >
        <span style={{ fontSize: size * 0.28, color: 'white', fontWeight: 700 }}>
          {node.breakDirection ? DIRECTION_ARROW[node.breakDirection] : '✕'}
        </span>
      </div>
    )
  }

  if (node.type === 'START') {
    return (
      <div
        style={{
          ...base,
          background: '#4096ff',
          boxShadow: node.isActive
            ? '0 0 0 4px rgba(22,119,255,0.55)'
            : '0 0 0 3px rgba(22,119,255,0.35)',
        }}
      >
        <span style={{ color: 'white', fontSize: size * 0.28 }}>S</span>
      </div>
    )
  }

  if (node.type === 'DESTINATION') {
    return (
      <div
        style={{
          ...base,
          background: node.isActive ? '#52c41a' : '#73d13d',
          boxShadow: node.isActive
            ? '0 0 0 4px rgba(82,196,26,0.55)'
            : '0 0 0 3px rgba(82,196,26,0.35)',
          animation: node.isActive ? 'none' : 'pulse 1.6s ease-in-out infinite',
        }}
      >
        <span style={{ color: 'white', fontSize: size * 0.28 }}>D</span>
      </div>
    )
  }

  // DEFAULT
  const isTrigger = node.isTrigger
  return (
    <div
      style={{
        ...base,
        background: node.isActive
          ? '#1677ff'
          : isTrigger
          ? 'rgba(255, 165, 0, 0.18)'
          : '#f0f5ff',
        border: isTrigger ? '2px dashed #fa8c16' : '2px solid transparent',
        boxShadow: node.isActive ? '0 0 0 4px rgba(22,119,255,0.45)' : 'none',
      }}
    />
  )
}
