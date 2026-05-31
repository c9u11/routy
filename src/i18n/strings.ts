import type { Lang } from '../hooks/useSettings'
import { useSettings } from '../hooks/useSettings'

// 라이브러리 없는 경량 i18n. `ko`를 소스로 두고 `en`을 동일 형태로 타입 검증.
// 사용: const t = useT(); t.home.subtitle / t.toast.bonus('120')

const ko = {
  home: {
    title: '길찾기 퍼즐',
    subtitle: '시작에서 도착까지 경로를 연결하세요',
    speedTitle: 'Speed Mode',
    speedDesc: '제한 시간 안에 최대한 많은 경로를 연결',
    infinityTitle: 'Infinity Mode',
    infinityDesc: '목숨 3개로 최장 경로를 찾아 무한 점수 도전',
    settingsAria: '설정 열기',
  },
  hud: {
    settingsAria: '설정 열기',
  },
  node: {
    start: '시작',
    goal: '도착',
  },
  gameOver: {
    speedTitle: "Time's Up!",
    infinityTitle: 'Gridlocked!',
    newBest: '🎉 최고 점수 갱신!',
    best: (n: string) => `최고: ${n}`,
    retry: '다시 시작',
    home: '홈으로',
  },
  toast: {
    speed: {
      EXCELLENT: { label: 'Excellent!', sub: '최장 경로 보너스' },
      GOOD: { label: 'Good', sub: '' },
      CLEAR: { label: 'Clear', sub: '' },
    },
    infinity: {
      EXCELLENT: { label: '완벽!', sub: '최장 경로 + 트리거 모두 통과' },
      GOOD: { label: '아쉬워요', sub: '조금 더 길게 돌아가세요' },
      CLEAR: { label: '위험!', sub: '너무 짧은 경로' },
    },
    bonus: (n: string) => `+${n} 보너스`,
    instantKo: '💀 즉사',
    lifeLost: (n: number) => `💔 목숨 ${n}`,
  },
  settings: {
    title: '설정',
    closeAria: '설정 닫기',
    haptic: { label: '진동', desc: '터치/도착/게임오버 햅틱 피드백' },
    shake: { label: '화면 흔들림', desc: '도착·게임오버 시 화면 흔들기' },
    sound: { label: '사운드', desc: '연결·도착·게임오버 효과음' },
    language: { label: '언어', desc: '앱 표시 언어' },
  },
  close: {
    title: '길찾기 퍼즐을 종료할까요?',
    cancel: '닫기',
    confirm: '종료하기',
  },
  tutorial: {
    title: '게임 방법',
    start: '시작하기',
    steps: [
      { icon: '👆', title: '시작 노드에서 출발', desc: '파란 "시작" 노드에서 드래그를 시작하세요.' },
      { icon: '🔗', title: '경로 연결', desc: '상하좌우 인접 노드를 따라 드래그해 "도착" 노드까지 연결하세요.' },
      { icon: '🎯', title: '멀리 돌아가면 고득점', desc: '중간 노드를 많이 거칠수록 점수가 폭발적으로 증가합니다.' },
      { icon: '🔶', title: '주황 테두리 노드', desc: '통과하면 인접한 방해물을 제거합니다. 적극 활용하세요!' },
      { icon: '🎮', title: '모드 선택', desc: 'Speed는 시간 제한 / Infinity는 목숨 3개로 최장 경로 도전.' },
    ],
  },
}

type Messages = typeof ko

const en: Messages = {
  home: {
    title: 'Path Puzzle',
    subtitle: 'Connect a path from start to goal',
    speedTitle: 'Speed Mode',
    speedDesc: 'Connect as many paths as you can before time runs out',
    infinityTitle: 'Infinity Mode',
    infinityDesc: '3 lives — chase the longest path for an endless score',
    settingsAria: 'Open settings',
  },
  hud: {
    settingsAria: 'Open settings',
  },
  node: {
    start: 'Start',
    goal: 'Goal',
  },
  gameOver: {
    speedTitle: "Time's Up!",
    infinityTitle: 'Gridlocked!',
    newBest: '🎉 New Best Score!',
    best: (n: string) => `Best: ${n}`,
    retry: 'Retry',
    home: 'Home',
  },
  toast: {
    speed: {
      EXCELLENT: { label: 'Excellent!', sub: 'Longest-path bonus' },
      GOOD: { label: 'Good', sub: '' },
      CLEAR: { label: 'Clear', sub: '' },
    },
    infinity: {
      EXCELLENT: { label: 'Perfect!', sub: 'Longest path + all triggers' },
      GOOD: { label: 'So close', sub: 'Take a longer route' },
      CLEAR: { label: 'Danger!', sub: 'Path too short' },
    },
    bonus: (n: string) => `+${n} bonus`,
    instantKo: '💀 Instant KO',
    lifeLost: (n: number) => `💔 ${Math.abs(n)} life`,
  },
  settings: {
    title: 'Settings',
    closeAria: 'Close settings',
    haptic: { label: 'Haptics', desc: 'Touch / goal / game-over vibration' },
    shake: { label: 'Screen shake', desc: 'Shake screen on goal & game over' },
    sound: { label: 'Sound', desc: 'Connect / goal / game-over effects' },
    language: { label: 'Language', desc: 'App display language' },
  },
  close: {
    title: 'Quit Path Puzzle?',
    cancel: 'Cancel',
    confirm: 'Quit',
  },
  tutorial: {
    title: 'How to Play',
    start: 'Start',
    steps: [
      { icon: '👆', title: 'Start from the start node', desc: 'Begin dragging from the blue "Start" node.' },
      { icon: '🔗', title: 'Connect the path', desc: 'Drag through adjacent nodes (up/down/left/right) to reach the "Goal".' },
      { icon: '🎯', title: 'Longer route, higher score', desc: 'The more waypoints you pass, the more your score explodes.' },
      { icon: '🔶', title: 'Orange-bordered nodes', desc: 'Passing one clears the adjacent obstacle. Use them well!' },
      { icon: '🎮', title: 'Pick a mode', desc: 'Speed is time-limited / Infinity gives 3 lives to chase the longest path.' },
    ],
  },
}

const strings: Record<Lang, Messages> = { ko, en }

export function useT(): Messages {
  const { lang } = useSettings()
  return strings[lang]
}

export type { Messages }
