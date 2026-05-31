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
    theme: { label: '테마', desc: '화면 밝기 모드' },
    themeSystem: '시스템',
    themeLight: '라이트',
    themeDark: '다크',
    howToPlay: { label: '게임 방법', desc: '모드별 플레이 방법 다시 보기' },
  },
  close: {
    title: '길찾기 퍼즐을 종료할까요?',
    cancel: '닫기',
    confirm: '종료하기',
  },
  tutorial: {
    start: '시작하기',
    close: '확인',
    pickMode: '어떤 모드를 볼까요?',
    commonTitle: '공통 규칙',
    common: [
      '파란 "시작"에서 드래그해 상하좌우로 이어 "도착"까지 연결하세요.',
      '중간 노드를 많이 거칠수록 점수가 제곱으로 늘어요.',
      '주황 테두리(트리거)를 지나면 인접한 방해물을 통과할 수 있어요.',
    ],
    speed: {
      name: 'Speed Mode',
      points: [
        '제한 시간 안에 도착까지 연결하면 다음 라운드로 이어져요.',
        '최장 경로로 클리어하면 보너스 점수를 받아요.',
      ],
    },
    infinity: {
      name: 'Infinity Mode',
      points: [
        '목숨은 3개 — 경로가 짧으면 목숨이 줄어요.',
        '최장 경로(완벽!)면 목숨을 지키며 끝없이 도전할 수 있어요.',
      ],
    },
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
    theme: { label: 'Theme', desc: 'Display brightness mode' },
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    howToPlay: { label: 'How to Play', desc: 'Replay the guide for each mode' },
  },
  close: {
    title: 'Quit Path Puzzle?',
    cancel: 'Cancel',
    confirm: 'Quit',
  },
  tutorial: {
    start: 'Start',
    close: 'Got it',
    pickMode: 'Which mode?',
    commonTitle: 'Common rules',
    common: [
      'Drag from the blue "Start" through adjacent nodes to reach the "Goal".',
      'The more waypoints you pass, the more your score grows (squared).',
      'Pass an orange-bordered node (trigger) to clear the adjacent obstacle.',
    ],
    speed: {
      name: 'Speed Mode',
      points: [
        'Reach the goal before time runs out to advance to the next round.',
        'Clear with the longest path for a bonus score.',
      ],
    },
    infinity: {
      name: 'Infinity Mode',
      points: [
        '3 lives — a short path costs you a life.',
        'Take the longest path (Perfect!) to keep your lives and play forever.',
      ],
    },
  },
}

const strings: Record<Lang, Messages> = { ko, en }

export function useT(): Messages {
  const { lang } = useSettings()
  return strings[lang]
}

export type { Messages }
