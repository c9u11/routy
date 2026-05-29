import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'routy',
  brand: {
    displayName: '길찾기 퍼즐',
    primaryColor: '#1677ff', // 게임 메인 컬러 (HomeScreen 아이콘/HUD 강조와 일치)
    icon: '', // 토스 콘솔에 아이콘 업로드 후 URL 반영
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'tsc && vite build',
    },
  },
  permissions: [], // haptic, share 등 기본 브릿지는 권한 불필요
  outdir: 'dist',
})
