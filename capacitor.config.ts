import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.routy.app',
  appName: '길찾기 퍼즐',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    scrollEnabled: false,
    // 안전영역(노치/홈 인디케이터)에 보이는 네이티브 배경.
    // 앱 배경(흰색)과 맞춰 상/하단 파란 레터박스 제거. 다크 모드 시 런타임에서 갱신.
    backgroundColor: '#ffffff',
  },
  plugins: {
    StatusBar: {
      // Capacitor Style.Light = 밝은 배경 위 '어두운 글자' (직관과 반대)
      style: 'LIGHT',
      backgroundColor: '#ffffff',
      overlaysWebView: false,
    },
    SplashScreen: {
      backgroundColor: '#1677ff',
      androidScaleType: 'CENTER_CROP',
      launchAutoHide: true,
      launchShowDuration: 1500,
    },
  },
}

export default config
