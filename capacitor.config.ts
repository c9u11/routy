import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.routy.app',
  appName: '길찾기 퍼즐',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    scrollEnabled: false,
    // 토스/Play와 동일한 brand color
    backgroundColor: '#1677ff',
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#1677ff',
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
