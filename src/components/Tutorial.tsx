interface Props {
  onDone: () => void
}

const STEPS = [
  {
    icon: '👆',
    title: 'S에서 시작',
    desc: '파란 S 노드에서 드래그를 시작하세요.',
  },
  {
    icon: '🔗',
    title: '경로 연결',
    desc: '상하좌우 인접 노드를 따라 드래그해 D까지 연결하세요.',
  },
  {
    icon: '🎯',
    title: '멀리 돌아가면 고득점',
    desc: '중간 노드를 많이 거칠수록 점수가 폭발적으로 증가합니다.',
  },
  {
    icon: '🔶',
    title: '주황 테두리 노드',
    desc: '통과하면 인접한 방해물을 제거합니다. 적극 활용하세요!',
  },
  {
    icon: '🎮',
    title: '모드 선택',
    desc: 'Speed는 시간 제한 / Infinity는 목숨 3개로 최장 경로 도전.',
  },
]

export default function Tutorial({ onDone }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        padding: '0 16px 32px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 28,
          padding: '32px 24px 28px',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>
          게임 방법
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#f5f8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: '#8c8c8c', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onDone}
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
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
