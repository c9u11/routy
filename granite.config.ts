import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "routy",
  brand: {
    displayName: "길찾기 퍼즐",
    primaryColor: "#1677ff",
    icon: "https://raw.githubusercontent.com/c9u11/routy/main/public/logo-master.svg"
  },
  web: {
    host: "192.168.100.42",
    port: 5173,
    commands: {
      dev: "vite --host",
      build: "tsc && vite build"
    }
  },
  permissions: [],
  outdir: "dist",
  webViewProps: {
    type: "game"
  }
});
