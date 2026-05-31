import { useT } from '../i18n/strings'
import { useTheme } from '../theme/theme'

interface Props {
  onDone: () => void
}

export default function Tutorial({ onDone }: Props) {
  const t = useT()
  const c = useTheme()
  const STEPS = t.tutorial.steps
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: c.overlayStrong,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        padding: '0 16px 32px',
      }}
    >
      <div
        style={{
          background: c.surface,
          borderRadius: 28,
          padding: '32px 24px 28px',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color: c.text, marginBottom: 24 }}>
          {t.tutorial.title}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: c.surfaceAlt,
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
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 2 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5 }}>{step.desc}</div>
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
          {t.tutorial.start}
        </button>
      </div>
    </div>
  )
}
