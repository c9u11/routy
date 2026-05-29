import { useEffect, useState } from 'react'
import type { RoundRatingInfo } from '../types/game'

type Mode = 'SPEED' | 'INFINITY'

const TIER_STYLE: Record<Mode, Record<RoundRatingInfo['tier'], { label: string; color: string; sub?: string }>> = {
  SPEED: {
    EXCELLENT: { label: 'Excellent!', color: '#fa8c16', sub: '최장 경로 보너스' },
    GOOD: { label: 'Good', color: '#1677ff' },
    CLEAR: { label: 'Clear', color: '#8c8c8c' },
  },
  INFINITY: {
    EXCELLENT: { label: '완벽!', color: '#fa8c16', sub: '최장 경로 + 트리거 모두 통과' },
    GOOD: { label: '아쉬워요', color: '#1677ff', sub: '조금 더 길게 돌아가세요' },
    CLEAR: { label: '위험!', color: '#cf1322', sub: '너무 짧은 경로' },
  },
}

interface Props {
  info: RoundRatingInfo | undefined
  lifeDelta?: number  // 인피니티 모드의 목숨 변동 (0 / -1 / -3). undefined면 Speed 모드.
}

export default function RoundRatingToast({ info, lifeDelta }: Props) {
  const mode: Mode = lifeDelta !== undefined ? 'INFINITY' : 'SPEED'
  const [visibleKey, setVisibleKey] = useState<number | null>(null)

  useEffect(() => {
    if (!info) return
    setVisibleKey(info.key)
    const t = setTimeout(() => setVisibleKey(null), 1200)
    return () => clearTimeout(t)
  }, [info?.key, info])

  if (!info || visibleKey !== info.key) return null

  const style = TIER_STYLE[mode][info.tier]
  const showBonus = info.tier === 'EXCELLENT' && info.bonus > 0
  const showLife = lifeDelta !== undefined && lifeDelta < 0

  return (
    <div
      key={info.key}
      style={{
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000,
        textAlign: 'center',
        animation: 'ratingPop 1.2s ease-out forwards',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: style.color,
          textShadow: '0 2px 12px rgba(0,0,0,0.15)',
          letterSpacing: -1,
        }}
      >
        {style.label}
      </div>
      {style.sub && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: style.color,
            marginTop: 4,
            opacity: 0.85,
          }}
        >
          {style.sub}
        </div>
      )}
      {showBonus && (
        <div
          style={{
            marginTop: 8,
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 99,
            background: style.color,
            color: 'white',
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          +{info.bonus.toLocaleString()} 보너스
        </div>
      )}
      {showLife && (
        <div
          style={{
            marginTop: 8,
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 99,
            background: '#ff4d4f',
            color: 'white',
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          {lifeDelta === -3 ? '💀 즉사' : `💔 목숨 ${lifeDelta}`}
        </div>
      )}
    </div>
  )
}
