import { useT } from '../i18n/strings'

interface Props {
  onCancel: () => void
  onConfirm: () => void
}

export default function CloseConfirmModal({ onCancel, onConfirm }: Props) {
  const t = useT()
  return (
    <div
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        padding: '0 24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 20,
          width: '100%',
          maxWidth: 320,
          padding: '24px 22px 18px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e', marginBottom: 22 }}>
          {t.close.title}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: '#f0f0f0',
              color: '#1a1a2e',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t.close.cancel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: '#1677ff',
              color: 'white',
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {t.close.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}
