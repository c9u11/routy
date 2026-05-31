import { useState, useCallback, useEffect } from 'react'
import { graniteEvent, closeView } from '@apps-in-toss/web-framework'
import type { GameMode, Screen } from './types/game'
import { useGameState } from './hooks/useGameState'
import { reloadSettings, useSettings } from './hooks/useSettings'
import { useTheme, applyDocumentChrome } from './theme/theme'
import { registerShakeRoot } from './utils/feedback'
import { getString, setString, hydrate } from './utils/storage'
import { fetchAnonymousKey } from './utils/anonymousKey'
import HomeScreen from './components/HomeScreen'
import Grid from './components/Grid'
import HUD from './components/HUD'
import GameOverScreen from './components/GameOverScreen'
import Tutorial from './components/Tutorial'
import RoundRatingToast from './components/RoundRatingToast'
import SettingsPanel from './components/SettingsPanel'
import CloseConfirmModal from './components/CloseConfirmModal'

const tutorialKey = (mode: GameMode) => `nc_tutorial_${mode}`

export default function App() {
  const [screen, setScreen] = useState<Screen>('HOME')
  // viewOnly=false: 첫 플레이 게이트(닫으면 게임 시작) / true: 설정에서 다시 보기(닫기만)
  const [tutorial, setTutorial] = useState<{ mode: GameMode; viewOnly: boolean } | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const { state, startGame, restart, addNodeToPath, confirmPath, cancelPath } = useGameState()
  const { lang } = useSettings()
  const theme = useTheme()

  // 언어 변경 시 <html lang> 동기화 (접근성/스크린리더)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // 테마 변경 시 바디 배경/theme-color + 네이티브 StatusBar 갱신
  useEffect(() => {
    applyDocumentChrome(theme)
    import('@capacitor/status-bar')
      .then(({ StatusBar, Style }) => {
        StatusBar.setStyle({ style: theme.mode === 'dark' ? Style.Dark : Style.Light }).catch(() => {})
        StatusBar.setBackgroundColor({ color: theme.bg }).catch(() => {})
      })
      .catch(() => {/* 웹/토스: 무동작 */})
  }, [theme])

  // 토스 인앱 X 버튼 인터셉트 — 가이드상 종료 확인 모달 노출 필수.
  // graniteEvent.backEvent는 토스 환경에서만 fire되며, 리스너 등록 시 기본 닫기는 차단됨.
  // Vercel/로컬 환경에서는 무동작 (try/catch로 보호).
  useEffect(() => {
    try {
      const unsubscribe = graniteEvent.addEventListener('backEvent', {
        onEvent: () => setShowCloseConfirm(true),
        onError: () => {/* 무시 */},
      })
      return unsubscribe
    } catch {
      return undefined
    }
  }, [])

  // 부팅 시 한 번: Toss Storage 백필 + 익명 키 prefetch.
  // 둘 다 백그라운드. 렌더링은 차단하지 않음.
  useEffect(() => {
    hydrate().then(() => reloadSettings()).catch(() => {/* 무시 */})
    fetchAnonymousKey().catch(() => {/* 무시 */})
  }, [])

  const handleCloseConfirm = useCallback(() => {
    closeView().catch(() => {/* 무시 — 토스 외부에선 호출 실패해도 OK */})
  }, [])

  // 게임 화면 div가 마운트될 때 자동 등록 (HOME → GAME 전환 시 ref가 늦게 잡히는 문제 회피)
  const shakeRootRef = useCallback((el: HTMLDivElement | null) => {
    registerShakeRoot(el)
  }, [])

  const handleStart = useCallback((mode: GameMode) => {
    // 모드별 첫 플레이면 해당 모드 튜토리얼 노출
    if (!getString(tutorialKey(mode))) {
      setTutorial({ mode, viewOnly: false })
      return
    }
    startGame(mode)
    setScreen('GAME')
  }, [startGame])

  const handleTutorialDone = useCallback(() => {
    if (!tutorial) return
    setString(tutorialKey(tutorial.mode), '1')
    const { mode, viewOnly } = tutorial
    setTutorial(null)
    // 첫 플레이 게이트였다면 곧바로 게임 시작 (설정 다시 보기면 닫기만)
    if (!viewOnly) {
      startGame(mode)
      setScreen('GAME')
    }
  }, [tutorial, startGame])

  // 설정 → '게임 방법' → 모드 선택 시: 설정 닫고 해당 모드 튜토리얼을 보기 전용으로 노출
  const handleShowTutorial = useCallback((mode: GameMode) => {
    setShowSettings(false)
    setTutorial({ mode, viewOnly: true })
  }, [])

  const handleRestart = useCallback(() => {
    restart()
  }, [restart])

  const handleHome = useCallback(() => {
    setScreen('HOME')
  }, [])

  if (screen === 'HOME') {
    return (
      <>
        <HomeScreen onStart={handleStart} onOpenSettings={() => setShowSettings(true)} />
        {tutorial && <Tutorial mode={tutorial.mode} viewOnly={tutorial.viewOnly} onDone={handleTutorialDone} />}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onShowTutorial={handleShowTutorial} />}
        {showCloseConfirm && (
          <CloseConfirmModal
            onCancel={() => setShowCloseConfirm(false)}
            onConfirm={handleCloseConfirm}
          />
        )}
      </>
    )
  }

  return (
    <div
      ref={shakeRootRef}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: theme.bg,
        // Safe area 적용: 노치/Dynamic Island/홈 인디케이터 가려짐 방지
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(24px, env(safe-area-inset-left))',
        paddingRight: 'max(24px, env(safe-area-inset-right))',
        gap: 24,
      }}
    >
      {/* Top bar: 홈으로 (좌측 고정 — 토스 닫기 X는 우측이므로 충돌 없음).
          설정 버튼은 HUD 우측으로 이동해 토스 X 영역과 분리. */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button
          onClick={handleHome}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.textMuted,
            fontSize: 15,
            fontWeight: 600,
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ← 홈
        </button>
      </div>

      <HUD state={state} onOpenSettings={() => setShowSettings(true)} />

      <Grid
        matrix={state.matrix}
        currentPath={state.currentPath}
        gridSize={state.gridSize}
        onAddNode={addNodeToPath}
        onConfirm={confirmPath}
        onCancel={cancelPath}
        disabled={state.isGameOver}
      />

      {state.isGameOver && (
        <GameOverScreen
          score={state.score}
          bestScore={state.bestScore}
          gameMode={state.gameMode}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {!state.isGameOver && (
        <RoundRatingToast
          info={state.lastRoundRating}
          lifeDelta={state.gameMode === 'INFINITY' ? state.lastLifeDelta : undefined}
        />
      )}

      {tutorial && <Tutorial mode={tutorial.mode} viewOnly={tutorial.viewOnly} onDone={handleTutorialDone} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onShowTutorial={handleShowTutorial} />}
      {showCloseConfirm && (
        <CloseConfirmModal
          onCancel={() => setShowCloseConfirm(false)}
          onConfirm={handleCloseConfirm}
        />
      )}
    </div>
  )
}
