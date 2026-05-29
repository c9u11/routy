import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameMode, Screen } from './types/game'
import { useGameState } from './hooks/useGameState'
import { registerShakeRoot } from './utils/feedback'
import HomeScreen from './components/HomeScreen'
import Grid from './components/Grid'
import HUD from './components/HUD'
import GameOverScreen from './components/GameOverScreen'
import Tutorial from './components/Tutorial'
import RoundRatingToast from './components/RoundRatingToast'

const TUTORIAL_KEY = 'nc_tutorial_done'

export default function App() {
  const [screen, setScreen] = useState<Screen>('HOME')
  const [showTutorial, setShowTutorial] = useState(false)
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null)
  const shakeRootRef = useRef<HTMLDivElement>(null)

  const { state, startGame, restart, addNodeToPath, confirmPath, cancelPath } = useGameState()

  useEffect(() => {
    registerShakeRoot(shakeRootRef.current)
    return () => registerShakeRoot(null)
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
        <HomeScreen onStart={handleStart} />
        {showTutorial && <Tutorial onDone={handleTutorialDone} />}
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
      {/* Back button */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', alignItems: 'center' }}>
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
    </div>
  )
}
