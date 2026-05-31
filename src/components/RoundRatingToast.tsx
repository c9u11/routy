import { useEffect, useState } from 'react'
import type { RoundRatingInfo } from '../types/game'
import { useT } from '../i18n/strings'

type Mode = 'SPEED' | 'INFINITY'

const TIER_COLOR: Record<Mode, Record<RoundRatingInfo['tier'], string>> = {
  SPEED: { EXCELLENT: '#fa8c16', GOOD: '#1677ff', CLEAR: '#8c8c8c' },
  INFINITY: { EXCELLENT: '#fa8c16', GOOD: '#1677ff', CLEAR: '#cf1322' },
}

interface Props {
  info: RoundRatingInfo | undefined
  lifeDelta?: number  // 인피니티 모드의 목숨 변동 (0 / -1 / -3). undefined면 Speed 모드.
}

export default function RoundRatingToast({ info, lifeDelta }: Props) {
  const t = useT()
  const mode: Mode = lifeDelta !== undefined ? 'INFINITY' : 'SPEED'
  const [visibleKey, setVisibleKey] = useState<number | null>(null)

  useEffect(() => {
    if (!info) return
    setVisibleKey(info.key)
    const timer = setTimeout(() => setVisibleKey(null), 1200)
    return () => clearTimeout(timer)
  }, [info?.key, info])

  if (!info || visibleKey !== info.key) return null

  const color = TIER_COLOR[mode][info.tier]
  const text = (mode === 'INFINITY' ? t.toast.infinity : t.toast.speed)[info.tier]
  const style = { label: text.label, color, sub: text.sub }
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
          {t.toast.bonus(info.bonus.toLocaleString())}
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
          {lifeDelta === -3 ? t.toast.instantKo : t.toast.lifeLost(lifeDelta)}
        </div>
      )}
    </div>
  )
}
