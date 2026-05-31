import { useEffect, useState } from 'react'
import type { GameMode } from '../types/game'
import { useT } from '../i18n/strings'
import { useTheme } from '../theme/theme'

interface Props {
  score: number
  bestScore: number
  gameMode: GameMode
  onRestart: () => void
  onHome: () => void
}

export default function GameOverScreen({ score, bestScore, gameMode, onRestart, onHome }: Props) {
  const t = useT()
  const c = useTheme()
  const [visible, setVisible] = useState(false)
  const isNewBest = score >= bestScore && score > 0

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: c.gameOverScrim,
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        padding: 32,
      }}
    >
      <div
        style={{
          background: c.surface,
          borderRadius: 28,
          padding: '40px 32px',
          width: '100%',
          maxWidth: 360,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          textAlign: 'center',
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>
          {isNewBest ? '🏆' : '🎮'}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: c.text, marginBottom: 4 }}>
          {gameMode === 'SPEED' ? t.gameOver.speedTitle : t.gameOver.infinityTitle}
        </div>
        {isNewBest && (
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1677ff', marginBottom: 16 }}>
            {t.gameOver.newBest}
          </div>
        )}

        <div
          style={{
            background: c.surfaceAlt,
            borderRadius: 16,
            padding: '20px 24px',
            margin: '20px 0',
          }}
        >
          <div style={{ fontSize: 12, color: c.textMuted, fontWeight: 600, letterSpacing: 0.5 }}>SCORE</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#1677ff', lineHeight: 1.1 }}>
            {score.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>
            {t.gameOver.best(Math.max(score, bestScore).toLocaleString())}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <button
            onClick={onRestart}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: 'none',
              background: '#1677ff',
              color: 'white',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseDown={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseUp={e => (e.currentTarget.style.opacity = '1')}
          >
            {t.gameOver.retry}
          </button>
          <button
            onClick={onHome}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: `2px solid ${c.border}`,
              background: c.surface,
              color: c.textSecondary,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {t.gameOver.home}
          </button>
        </div>
      </div>
    </div>
  )
}
