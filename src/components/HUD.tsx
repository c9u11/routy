import type { GameState } from '../types/game'
import { getSpeedTimeConfig } from '../utils/scoring'
import { useTheme } from '../theme/theme'

interface Props {
  state: GameState
  onOpenSettings: () => void
}

const INFINITY_MAX_LIVES = 3

export default function HUD({ state, onOpenSettings }: Props) {
  const { gameMode, score, bestScore, level, timeRemaining, gridSize, lives } = state
  const c = useTheme()

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: '0 4px' }}>
      {/* BEST(좌) · SCORE(중앙) · 설정(우) — 설정 버튼을 토스 닫기(X) 영역에서 분리 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'flex-end', marginBottom: 12 }}>
        <div style={{ justifySelf: 'start' }}>
          <div style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, letterSpacing: 0.5 }}>BEST</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: c.textSecondary }}>{Math.max(score, bestScore).toLocaleString()}</div>
        </div>
        <div style={{ justifySelf: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, letterSpacing: 0.5 }}>SCORE</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: c.text, lineHeight: 1.1 }}>{score.toLocaleString()}</div>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="설정 열기"
          style={{
            justifySelf: 'end',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: c.textMuted,
            fontSize: 22,
            padding: 4,
            lineHeight: 1,
          }}
        >
          ⚙
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <Chip label={gameMode === 'SPEED' ? `Lv.${level}` : 'Infinity'} color="#1677ff" />
        <Chip label={`${gridSize}×${gridSize}`} color="#722ed1" />
        {gameMode === 'INFINITY' && lives !== undefined && (
          <LivesIndicator current={lives} max={INFINITY_MAX_LIVES} />
        )}
      </div>

      {gameMode === 'SPEED' && (
        <TimeBar timeRemaining={timeRemaining} maxTime={getSpeedTimeConfig(level).initial * 2} />
      )}
    </div>
  )
}

function LivesIndicator({ current, max }: { current: number; max: number }) {
  const c = useTheme()
  const filled = Math.max(0, Math.min(current, max))
  return (
    <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: 18,
            lineHeight: 1,
            color: i < filled ? '#ff4d4f' : c.toggleOff,
            filter: i < filled ? 'none' : 'grayscale(1)',
            transition: 'color 0.2s',
          }}
        >
          {i < filled ? '❤️' : '🤍'}
        </span>
      ))}
    </div>
  )
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        padding: '2px 10px',
        borderRadius: 99,
        background: color + '18',
        color,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {label}
    </div>
  )
}

function TimeBar({ timeRemaining, maxTime }: { timeRemaining: number; maxTime: number }) {
  const c = useTheme()
  const pct = Math.max(0, Math.min(1, timeRemaining / maxTime))
  const color = pct > 0.4 ? '#1677ff' : pct > 0.2 ? '#fa8c16' : '#ff4d4f'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 600 }}>TIME</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{timeRemaining.toFixed(1)}s</span>
      </div>
      <div
        style={{
          width: '100%',
          height: 8,
          borderRadius: 99,
          background: c.surfaceAlt,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            borderRadius: 99,
            background: color,
            transition: 'width 0.1s linear, background 0.3s',
          }}
        />
      </div>
    </div>
  )
}
