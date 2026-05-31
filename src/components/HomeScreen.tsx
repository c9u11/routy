import type { GameMode } from '../types/game'

interface Props {
  onStart: (mode: GameMode) => void
  onOpenSettings: () => void
}

export default function HomeScreen({ onStart, onOpenSettings }: Props) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Safe area 적용
        paddingTop: 'max(32px, env(safe-area-inset-top))',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(24px, env(safe-area-inset-left))',
        paddingRight: 'max(24px, env(safe-area-inset-right))',
        background: 'white',
        position: 'relative',
      }}
    >
      <button
        onClick={onOpenSettings}
        aria-label="설정 열기"
        style={{
          position: 'absolute',
          top: 'max(20px, env(safe-area-inset-top))',
          // 토스 닫기(X)는 우상단 → 설정은 좌상단으로 분리
          left: 'max(22px, env(safe-area-inset-left))',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#8c8c8c',
          fontSize: 22,
          padding: 4,
        }}
      >
        ⚙
      </button>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#1677ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(22,119,255,0.32)',
              flexShrink: 0,
            }}
          >
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
              <path d="M16 16 L16 32 L32 32 L32 48 L48 48"
                stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95"/>
              <circle cx="16" cy="32" r="3.5" fill="white" opacity="0.85"/>
              <circle cx="32" cy="32" r="3.5" fill="white" opacity="0.85"/>
              <circle cx="32" cy="48" r="3.5" fill="white" opacity="0.85"/>
              <circle cx="48" cy="16" r="2" fill="white" opacity="0.3"/>
              <circle cx="48" cy="32" r="2" fill="white" opacity="0.3"/>
              <circle cx="16" cy="48" r="2" fill="white" opacity="0.3"/>
              <circle cx="16" cy="16" r="5.5" fill="#4096ff" stroke="white" strokeWidth="2.2"/>
              <circle cx="48" cy="48" r="5.5" fill="#52c41a" stroke="white" strokeWidth="2.2"/>
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', margin: 0, lineHeight: 1.1 }}>
              길찾기 퍼즐
            </h1>
            <p style={{ fontSize: 12, color: '#bfbfbf', margin: '4px 0 0', fontWeight: 700, letterSpacing: 1.2 }}>
              ROUTY
            </p>
          </div>
        </div>
        <p style={{ fontSize: 15, color: '#8c8c8c', margin: 0, fontWeight: 500 }}>
          시작에서 도착까지 경로를 연결하세요
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
