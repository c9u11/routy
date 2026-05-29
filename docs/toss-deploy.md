# 토스 미니앱(앱인토스) 배포 워크플로

## 사전 준비

- `ax` CLI 설치 — macOS: `brew tap toss/tap && brew install ax`
- `@apps-in-toss/web-framework` 설치 — 이미 `package.json` 의존성에 포함
- 토스 개발자 콘솔에서 앱 등록 → API 키 발급
- `granite.config.ts`의 `brand.icon`은 콘솔에 아이콘 업로드 후 받은 URL로 채울 것

## 토큰 등록 (1회)

```bash
node_modules/.bin/ait token add --api-key <콘솔에서 발급한 키> default
```

저장된 토큰은 이후 `ait deploy`에서 자동 사용.

## 로컬 개발

```bash
# 토스 환경 인식 모드 (granite dev) — 권장
npm run dev

# 일반 vite (토스 브릿지 없이 빠른 확인)
npm run dev:vite
```

`granite dev`는 `granite.config.ts`의 `web.commands.dev`를 실행하며 토스 인앱 시뮬레이션에 필요한 부가 설정을 얹어줌. `isInToss()`는 둘 다에서 `false` — 실기 햅틱은 토스 인앱 또는 샌드박스 앱에서만.

## .ait 빌드

```bash
npm run build
# 내부적으로 `ait build` 실행 → granite.config.ts의 web.commands.build 호출
# → tsc + vite build → 산출물을 .ait 아티팩트로 패키징
```

생성된 `.ait` 파일 위치는 빌드 출력에서 확인. 일반적으로 `dist/` 또는 별도 산출물 경로.

## 배포

콘솔로 자동 업로드:
```bash
npm run deploy
# = ait deploy
# 옵션: --workspace <name>, --memo "릴리즈 메모", --location <stage>
```

수동 업로드: 콘솔 > 앱 릴리즈 > `.ait` 파일 첨부.

## 샌드박스 테스트

토스 앱에서 샌드박스 모드 활성화 후 deploymentId를 입력하면 인앱 미리보기 가능. 실기 햅틱/사운드/흔들림이 이 단계에서 검증됨.

## 출시 정책 주의

- 핀치줌 비활성화 필수 — `index.html`에 적용 완료
- 권한 사용 시 `granite.config.ts`의 `permissions` 배열에 명시
- 광고/결제는 별도 권한과 SDK 호출 필요 — Routy는 현재 미사용
