import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "routy",
  brand: {
    displayName: "길찾기 퍼즐",
    primaryColor: "#1677ff", // 게임 메인 컬러 (HomeScreen 아이콘/HUD 강조와 일치)
    // 토스 콘솔 업로드 전까지 임시로 GitHub raw 사용. 콘솔에서 발급한 URL로 교체 권장.
    icon: "https://raw.githubusercontent.com/c9u11/routy/main/public/logo-master.svg"
  },
  web: {
    // 실기기 테스트용 로컬 IP. 다른 머신/네트워크에서는 본인 IP로 수정하거나 "localhost"로 변경.
    host: "192.168.100.42",
    port: 5173,
    commands: {
      dev: "vite --host",
      build: "tsc && vite build"
    }
  },
  permissions: [], // haptic, share 등 기본 브릿지는 권한 불필요
  outdir: "dist"
});
