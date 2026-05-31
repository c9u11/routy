import { useSettings, setSetting } from '../hooks/useSettings'
import type { GameMode } from '../types/game'
import { useT } from '../i18n/strings'
import { useTheme } from '../theme/theme'

interface Props {
  onClose: () => void
  onShowTutorial: (mode: GameMode) => void
}

type ToggleKey = 'haptic' | 'shake' | 'sound'

export default function SettingsPanel({ onClose, onShowTutorial }: Props) {
  const settings = useSettings()
  const t = useT()
  const c = useTheme()

  const items: { key: ToggleKey; label: string; desc: string }[] = [
    { key: 'haptic', label: t.settings.haptic.label, desc: t.settings.haptic.desc },
    { key: 'shake', label: t.settings.shake.label, desc: t.settings.shake.desc },
    { key: 'sound', label: t.settings.sound.label, desc: t.settings.sound.desc },
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: c.overlay,
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
          background: c.surface,
          borderRadius: 24,
          padding: '24px 22px 20px',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>{t.settings.title}</div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 20,
              color: c.textMuted,
              padding: 4,
            }}
            aria-label={t.settings.closeAria}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map(item => (
            <Toggle
              key={item.key}
              label={item.label}
              desc={item.desc}
              checked={settings[item.key]}
              onChange={(v) => setSetting(item.key, v)}
            />
          ))}
          <Segmented
            label={t.settings.language.label}
            desc={t.settings.language.desc}
            value={settings.lang}
            options={[{ value: 'ko', label: '한국어' }, { value: 'en', label: 'English' }]}
            onChange={(v) => setSetting('lang', v)}
          />
          <Segmented
            label={t.settings.theme.label}
            desc={t.settings.theme.desc}
            value={settings.theme}
            options={[
              { value: 'system', label: t.settings.themeSystem },
              { value: 'light', label: t.settings.themeLight },
              { value: 'dark', label: t.settings.themeDark },
            ]}
            onChange={(v) => setSetting('theme', v)}
          />

          {/* 게임 방법 — 모드별 버튼을 바로 노출 */}
          <div style={{ padding: '12px 4px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>{t.settings.howToPlay.label}</div>
            <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2, marginBottom: 10 }}>{t.settings.howToPlay.desc}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['SPEED', 'INFINITY'] as GameMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => onShowTutorial(mode)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 12,
                    border: `2px solid ${mode === 'SPEED' ? '#1677ff' : '#722ed1'}30`,
                    background: `${mode === 'SPEED' ? '#1677ff' : '#722ed1'}10`,
                    color: c.text,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {mode === 'SPEED' ? `⚡ ${t.tutorial.speed.name}` : `∞ ${t.tutorial.infinity.name}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Segmented<T extends string>({
  label,
  desc,
  value,
  options,
  onChange,
}: {
  label: string
  desc: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  const c = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>{label}</div>
        <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', background: c.surfaceAlt, borderRadius: 10, padding: 2, flexShrink: 0 }}>
        {options.map(opt => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                border: 'none',
                cursor: 'pointer',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 700,
                background: active ? c.surface : 'transparent',
                color: active ? '#1677ff' : c.textMuted,
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {opt.label}
            </button>
          )
        })}
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
  const c = useTheme()
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
        <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>{label}</div>
        <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{desc}</div>
      </div>
      <div
        style={{
          width: 44,
          height: 26,
          borderRadius: 99,
          background: checked ? '#1677ff' : c.toggleOff,
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
