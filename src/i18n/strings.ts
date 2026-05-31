import type { Lang } from '../hooks/useSettings'
import { useSettings } from '../hooks/useSettings'

// 라이브러리 없는 경량 i18n. `ko`를 소스로 두고 `en`을 동일 형태로 타입 검증.
// 사용: const t = useT(); t.home.subtitle / t.toast.bonus('120')

const ko = {
  home: {
    title: '길찾기 퍼즐',
    tagline: 'ROUTY',
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
  nav: {
    home: '홈',
  },
  node: {
    start: '시작',
    goal: '도착',
  },
  gameOver: {
    speedTitle: '시간 종료!',
    infinityTitle: '게임 오버!',
    newBest: '🎉 최고 점수 갱신!',
    best: (n: string) => `최고: ${n}`,
    retry: '다시 시작',
    home: '홈으로',
  },
  toast: {
    speed: {
      EXCELLENT: { label: '훌륭해요!', sub: '최장 경로 보너스' },
      GOOD: { label: '좋아요', sub: '' },
      CLEAR: { label: '통과', sub: '' },
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
    commonTitle: '기본 규칙',
    common: [
      '파란 "시작"에서 드래그해 상하좌우로 이어 "도착"까지 연결하세요.',
      '거쳐 간 중간 노드가 많을수록 점수가 커져요.',
    ],
    scoreTitle: '점수 구조',
    lives: { EXCELLENT: '목숨 유지', GOOD: '목숨 -1', CLEAR: '목숨 -3' },
    speed: {
      name: 'Speed Mode',
      points: [
        '제한 시간 안에 도착까지 연결하면 다음 라운드로 이어져요.',
        '방해물(빨강)은 벽이에요 — 돌아서 피하세요. 라운드마다 새로 배치돼요.',
      ],
      scores: [
        '기본 점수 = 거쳐 간 중간 노드 수의 제곱',
        '최장 경로(훌륭해요!)면 1.5배 보너스 + 시간 추가',
        '1~2칸 부족하면 좋아요, 너무 짧으면 통과 — 보너스 없음',
      ],
    },
    infinity: {
      name: 'Infinity Mode',
      points: [
        '주황 테두리(트리거)를 지나면 인접한 방해물을 통과할 수 있어요.',
        '목숨은 3개 — 라운드 평가에 따라 줄어들어요.',
      ],
      scores: [
        '기본 점수 = 거쳐 간 중간 노드 수의 제곱',
        '최장 경로면 완벽! — 목숨 유지(±0)',
        '1~2칸 부족하면 목숨 -1, 너무 짧으면 -3',
      ],
    },
  },
}

type Messages = typeof ko

const en: Messages = {
  home: {
    title: 'Routy',
    tagline: 'PATH PUZZLE',
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
  nav: {
    home: 'Home',
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
    commonTitle: 'Basics',
    common: [
      'Drag from the blue "Start" through adjacent nodes to reach the "Goal".',
      'The more waypoints you pass through, the higher your score.',
    ],
    scoreTitle: 'Scoring',
    lives: { EXCELLENT: 'Keep lives', GOOD: '−1 life', CLEAR: '−3 lives' },
    speed: {
      name: 'Speed Mode',
      points: [
        'Reach the goal before time runs out to advance to the next round.',
        'Obstacles (red) are walls — route around them. They reshuffle each round.',
      ],
      scores: [
        'Base score = (number of waypoints passed)²',
        'Longest path (Excellent) → 1.5× bonus + extra time',
        '1–2 short → Good, much shorter → Clear (no bonus)',
      ],
    },
    infinity: {
      name: 'Infinity Mode',
      points: [
        'Pass an orange-bordered node (trigger) to clear the adjacent obstacle.',
        '3 lives — they drop based on your round rating.',
      ],
      scores: [
        'Base score = (number of waypoints passed)²',
        'Longest path → Perfect! — keep your lives (±0)',
        '1–2 short → −1 life, much shorter → −3',
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
