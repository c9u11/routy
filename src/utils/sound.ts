import { getSettings } from '../hooks/useSettings'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {/* 무시 */})
    return ctx
  }
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    return ctx
  } catch {
    return null
  }
}

// 단일 톤 재생: freq Hz를 durationMs 동안 wave 형태로, attack/release 엔벨로프 적용.
function playTone(
  freq: number,
  durationMs: number,
  wave: OscillatorType = 'triangle',
  startOffsetMs = 0,
  volume = 0.18,
) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + startOffsetMs / 1000
  const dur = durationMs / 1000
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = wave
  osc.frequency.setValueAtTime(freq, t0)
  // attack 5ms, release rest
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function enabled(): boolean {
  return getSettings().sound
}

// 노드 연결: 짧고 가벼운 클릭톤. 음 높이를 미세하게 변화 가능하지만 일단 고정.
export function soundNodeConnect() {
  if (!enabled()) return
  playTone(720, 50, 'triangle', 0, 0.12)
}

// 라운드 클리어 (도착): 상승 아르페지오 C5 → E5 → G5
export function soundDestination() {
  if (!enabled()) return
  playTone(523.25, 90, 'triangle', 0, 0.18)    // C5
  playTone(659.25, 90, 'triangle', 80, 0.18)   // E5
  playTone(783.99, 140, 'triangle', 160, 0.20) // G5
}

// 목숨 차감 (인피니티 Good/Clear): 단음 하강
export function soundLifeLost() {
  if (!enabled()) return
  playTone(440, 80, 'sawtooth', 0, 0.16)   // A4
  playTone(329.63, 140, 'sawtooth', 70, 0.16) // E4
}

// 게임 오버: 하강 라인
export function soundGameOver() {
  if (!enabled()) return
  playTone(392, 140, 'sawtooth', 0, 0.18)   // G4
  playTone(329.63, 140, 'sawtooth', 130, 0.18) // E4
  playTone(261.63, 260, 'sawtooth', 260, 0.18) // C4
}
