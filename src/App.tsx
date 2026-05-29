import { useState, useCallback, useEffect } from 'react'
import { graniteEvent, closeView } from '@apps-in-toss/web-framework'
import type { GameMode, Screen } from './types/game'
import { useGameState } from './hooks/useGameState'
import { registerShakeRoot } from './utils/feedback'
import HomeScreen from './components/HomeScreen'
import Grid from './components/Grid'
import HUD from './components/HUD'
import GameOverScreen from './components/GameOverScreen'
import Tutorial from './components/Tutorial'
import RoundRatingToast from './components/RoundRatingToast'
import SettingsPanel from './components/SettingsPanel'
import CloseConfirmModal from './components/CloseConfirmModal'

const TUTORIAL_KEY = 'nc_tutorial_done'

export default function App() {
  const [screen, setScreen] = useState<Screen>('HOME')
  const [showTutorial, setShowTutorial] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null)

  const { state, startGame, restart, addNodeToPath, confirmPath, cancelPath } = useGameState()

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

  const handleCloseConfirm = useCallback(() => {
    closeView().catch(() => {/* 무시 — 토스 외부에선 호출 실패해도 OK */})
  }, [])

  // 게임 화면 div가 마운트될 때 자동 등록 (HOME → GAME 전환 시 ref가 늦게 잡히는 문제 회피)
  const shakeRootRef = useCallback((el: HTMLDivElement | null) => {
    registerShakeRoot(el)
  }, [])

  const handleStart = useCallback((mode: GameMode) => {
    const done = localStorage.getItem(TUTORIAL_KEY)
    if (!done) {
      setPendingMode(mode)
      setShowTutorial(true)
      return
    }
    startGame(mode)
    setScreen('GAME')
  }, [startGame])

  const handleTutorialDone = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY, '1')
    setShowTutorial(false)
    if (pendingMode) {
      startGame(pendingMode)
      setScreen('GAME')
      setPendingMode(null)
    }
  }, [pendingMode, startGame])

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
        {showTutorial && <Tutorial onDone={handleTutorialDone} />}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
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
        background: '#fafbff',
        padding: '20px 24px 40px',
        gap: 24,
      }}
    >
      {/* Top bar: back + settings */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={handleHome}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8c8c8c',
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
        <button
          onClick={() => setShowSettings(true)}
          aria-label="설정 열기"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8c8c8c',
            fontSize: 20,
            padding: 4,
          }}
        >
          ⚙
        </button>
      </div>

      <HUD state={state} />

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

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showCloseConfirm && (
        <CloseConfirmModal
          onCancel={() => setShowCloseConfirm(false)}
          onConfirm={handleCloseConfirm}
        />
      )}
    </div>
  )
}
