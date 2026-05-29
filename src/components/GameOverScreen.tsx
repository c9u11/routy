import { useEffect, useState } from 'react'
import type { GameMode } from '../types/game'

interface Props {
  score: number
  bestScore: number
  gameMode: GameMode
  onRestart: () => void
  onHome: () => void
}

export default function GameOverScreen({ score, bestScore, gameMode, onRestart, onHome }: Props) {
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
        background: 'rgba(255,255,255,0.92)',
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
          background: 'white',
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
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>
          {gameMode === 'SPEED' ? 'Time\'s Up!' : 'Gridlocked!'}
        </div>
        {isNewBest && (
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1677ff', marginBottom: 16 }}>
            🎉 New Best Score!
          </div>
        )}

        <div
          style={{
            background: '#f5f8ff',
            borderRadius: 16,
            padding: '20px 24px',
            margin: '20px 0',
          }}
        >
          <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 600, letterSpacing: 0.5 }}>SCORE</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#1677ff', lineHeight: 1.1 }}>
            {score.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>
            Best: {Math.max(score, bestScore).toLocaleString()}
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
            다시 시작
          </button>
          <button
            onClick={onHome}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: '2px solid #f0f0f0',
              background: 'white',
              color: '#595959',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  )
}
