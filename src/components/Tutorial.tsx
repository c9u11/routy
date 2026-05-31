import type { GameMode } from '../types/game'
import { useT } from '../i18n/strings'
import { useTheme } from '../theme/theme'
import TutorialDemo from './TutorialDemo'

interface Props {
  mode: GameMode
  onDone: () => void
  viewOnly?: boolean
}

export default function Tutorial({ mode, onDone, viewOnly }: Props) {
  const t = useT()
  const c = useTheme()
  const modeText = mode === 'SPEED' ? t.tutorial.speed : t.tutorial.infinity
  const accent = mode === 'SPEED' ? '#1677ff' : '#722ed1'

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
          padding: '28px 24px 24px',
          width: '100%',
          maxWidth: 400,
          maxHeight: '88dvh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{ fontSize: 22 }}>{mode === 'SPEED' ? '⚡' : '∞'}</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: c.text }}>{modeText.name}</span>
        </div>

        <TutorialDemo mode={mode} />

        <Section title={t.tutorial.commonTitle} points={t.tutorial.common} color={c.textMuted} text={c.text} />
        <div style={{ height: 14 }} />
        <Section title={modeText.name} points={modeText.points} color={accent} text={c.text} />
        <div style={{ height: 14 }} />
        <Section title={t.tutorial.scoreTitle} points={modeText.scores} color={c.textMuted} text={c.text} />

        <button
          onClick={onDone}
          style={{
            width: '100%',
            marginTop: 24,
            padding: '16px',
            borderRadius: 14,
            border: 'none',
            background: accent,
            color: 'white',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          {viewOnly ? t.tutorial.close : t.tutorial.start}
        </button>
      </div>
    </div>
  )
}

function Section({ title, points, color, text }: { title: string; points: string[]; color: string; text: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 8, letterSpacing: 0.3 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color, fontWeight: 900, lineHeight: 1.5, flexShrink: 0 }}>·</span>
            <span style={{ fontSize: 13.5, color: text, lineHeight: 1.5 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
