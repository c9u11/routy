import { useSettings, setSetting, type Settings } from '../hooks/useSettings'

interface Props {
  onClose: () => void
}

const ITEMS: { key: keyof Settings; label: string; desc: string }[] = [
  { key: 'haptic', label: '진동', desc: '터치/도착/게임오버 햅틱 피드백' },
  { key: 'shake', label: '화면 흔들림', desc: '도착·게임오버 시 화면 흔들기' },
  { key: 'sound', label: '사운드', desc: '연결·도착·게임오버 효과음' },
]

export default function SettingsPanel({ onClose }: Props) {
  const settings = useSettings()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 300,
        padding: '0 16px 24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '24px 22px 20px',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e' }}>설정</div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 20,
              color: '#8c8c8c',
              padding: 4,
            }}
            aria-label="설정 닫기"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ITEMS.map(item => (
            <Toggle
              key={item.key}
              label={item.label}
              desc={item.desc}
              checked={settings[item.key]}
              onChange={(v) => setSetting(item.key, v)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{desc}</div>
      </div>
      <div
        style={{
          width: 44,
          height: 26,
          borderRadius: 99,
          background: checked ? '#1677ff' : '#d9d9d9',
          position: 'relative',
          transition: 'background 0.18s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'white',
            transition: 'left 0.18s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}
        />
      </div>
    </button>
  )
}
