import type { GameMode } from '../types/game'

interface Props {
  onStart: (mode: GameMode) => void
}

export default function HomeScreen({ onStart }: Props) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'white',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: '#1677ff',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="10" cy="10" r="6" fill="white" />
            <circle cx="34" cy="10" r="6" fill="rgba(255,255,255,0.5)" />
            <circle cx="10" cy="34" r="6" fill="rgba(255,255,255,0.5)" />
            <circle cx="34" cy="34" r="6" fill="white" />
            <line x1="10" y1="10" x2="34" y2="10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="10" x2="10" y2="34" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="34" y1="10" x2="34" y2="34" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', margin: '0 0 4px' }}>
          길찾기 퍼즐
        </h1>
        <p style={{ fontSize: 13, color: '#bfbfbf', margin: '0 0 8px', fontWeight: 700, letterSpacing: 1 }}>
          ROUTY
        </p>
        <p style={{ fontSize: 15, color: '#8c8c8c', margin: 0, fontWeight: 500 }}>
          S에서 D까지 경로를 연결하세요
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ModeCard
          title="Speed Mode"
          desc="제한 시간 안에 최대한 많은 경로를 연결"
          icon="⚡"
          color="#1677ff"
          onClick={() => onStart('SPEED')}
        />
        <ModeCard
          title="Infinity Mode"
          desc="목숨 3개로 최장 경로를 찾아 무한 점수 도전"
          icon="∞"
          color="#722ed1"
          onClick={() => onStart('INFINITY')}
        />
      </div>
    </div>
  )
}

function ModeCard({
  title,
  desc,
  icon,
  color,
  onClick,
}: {
  title: string
  desc: string
  icon: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '20px 24px',
        borderRadius: 20,
        border: `2px solid ${color}20`,
        background: `${color}08`,
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'background 0.15s, transform 0.12s',
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 500 }}>{desc}</div>
      </div>
    </button>
  )
}
