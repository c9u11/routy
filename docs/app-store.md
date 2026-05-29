# App Store 배포 워크플로 (Routy / 길찾기 퍼즐)

목적: 한국 자체등급분류사업자(애플)을 통해 게임 등급증명을 받아 토스 콘솔 "등급 정보" 필드에 App Store URL을 제출. 동시에 iOS 사용자에게도 정식 배포.

## 1. 사전 점검 ✅

- Apple Developer 계정 활성 (멤버십 유지 중)
- Xcode 설치됨
- Capacitor iOS 프로젝트 생성됨 (`ios/`)
- 번들 ID: `com.routy.app` (Play와 일치)
- 햅틱: `@capacitor/haptics`로 분기 처리 완료 (Apple 4.2 "Minimum Functionality" 대응)

## 2. 첫 빌드 — 매번 변경 시 반복

웹 코드 수정 후 iOS 앱에 반영하려면 매번:

```bash
# 1) 웹 빌드
npm run build:vite

# 2) 웹 산출물을 iOS 프로젝트로 복사
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" npx cap sync ios

# 3) Xcode 열기
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" npx cap open ios
```

⚠️ Capacitor 8은 Node 22+ 요구. 시스템 기본 node가 v20이라면 위처럼 nvm 경로 prepend.

## 3. Xcode에서 첫 설정 (1회)

`npx cap open ios`로 Xcode 열림. 좌측 트리에서 **App** 프로젝트 선택 → **Signing & Capabilities**:

- **Team**: Apple Developer 계정 팀 선택
- **Bundle Identifier**: `com.routy.app` 자동 설정됨 (capacitor.config.ts 기반)
- **Automatically manage signing**: ON
- Provisioning profile 자동 생성됨

만약 "No account for Team" 에러 → Xcode → Settings → Accounts에 Apple ID 로그인.

## 4. 디바이스/시뮬레이터 테스트

상단 디바이스 선택 드롭다운에서:
- 시뮬레이터: iPhone 15 Pro Max 권장 (스크린샷 매칭)
- 실기기: USB 연결된 iPhone 선택, 첫 실행 시 디바이스에서 "신뢰" 승인 필요

▶ (재생) 버튼으로 빌드 + 실행. 다음 확인:
- ✅ 앱 아이콘이 토스/Play용 logo와 동일하게 표시 (별도 설정 필요할 수 있음, 아래 5번 참조)
- ✅ 시작 노드 → 도착까지 드래그 정상
- ✅ 햅틱 동작 (실기기에서만 — 시뮬레이터는 햅틱 무반응)
- ✅ Safe area로 노치/Dynamic Island 회피
- ✅ 백그라운드 → 복귀 시 Speed 모드 타이머 일시정지/재개

## 5. iOS 앱 아이콘 — 별도 작업 필요

Capacitor 기본 아이콘이 들어 있으므로 우리 로고로 교체:

```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

여기에 1024×1024 PNG `AppIcon-1024.png`를 넣고 `Contents.json` 업데이트. 또는 `npx @capacitor/assets generate --ios` 사용 (별도 설치 필요).

빠른 대안 — `assets/console/icon-600.png`를 1024×1024로 업스케일해 수동 교체:
```bash
sips -z 1024 1024 assets/console/icon-600.png --out ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png
```

(필요 시 별도 커밋으로 진행)

## 6. App Store Connect — 앱 생성

https://appstoreconnect.apple.com/ → My Apps → **+** → New App

| 필드 | 값 |
|---|---|
| Platforms | iOS |
| Name | `길찾기 퍼즐` |
| Primary Language | Korean (한국어) |
| Bundle ID | `com.routy.app` (Xcode에서 등록되면 드롭다운에 나타남) |
| SKU | `routy-001` (임의) |
| User Access | Full Access |

## 7. App Store 정보 입력

생성된 앱에서 **App Store** 탭:

### 7-A. 일반 정보
- **이름**: 길찾기 퍼즐
- **부제**: 손가락으로 잇는 미니 두뇌 퍼즐
- **카테고리**: Primary = **Games**, Secondary = **Puzzle**
- **콘텐츠 권한**: 본인 콘텐츠 ✅

### 7-B. 가격 및 사용 가능 여부
- 가격: **무료**
- 사용 가능 국가: 한국만 또는 전체 (취향)

### 7-C. App 개인정보 보호
- 데이터 수집: **없음** 선택 → 모든 데이터 카테고리 "수집 안 함"
- 개인정보처리방침 URL: `https://routy-six.vercel.app/privacy.html`

### 7-D. 자체 등급 분류 (Age Rating)
설문 모두 "없음/None":
- Cartoon or Fantasy Violence: None
- Realistic Violence: None
- Sexual Content: None
- Profanity: None
- Drug/Alcohol Use: None
- Gambling: None
- Mature/Suggestive Themes: None
- Horror/Fear Themes: None
- Unrestricted Web Access: **No**
- Gambling and Contests: **No**

→ **4+** 자동 부여

### 7-E. 버전 정보 (1.0.0)
- **이 버전의 새로운 기능**: `최초 출시`
- **프로모션 텍스트**: `시작에서 도착까지, 한 번의 드래그로 잇는 미니 두뇌 퍼즐`
- **설명**: (한국어)
  ```
  시작에서 도착까지, 한 번의 드래그로 잇는 길찾기 퍼즐.

  · 두 가지 모드
    - Speed: 제한 시간 안에 최장 경로를 찾아 점수를 쌓아요.
    - Infinity: 목숨 3개로 끝없이 도전. 트리거를 모두 거치며 가장 먼 길을 찾아내야 살아남아요.

  · 핵심 규칙
    - 노드를 많이 지날수록 점수가 제곱으로 늘어요.
    - 방해물은 인접한 트리거 칸을 거치면 통과할 수 있어요.
    - 최장 경로로 클리어하면 점수 보너스. 짧은 경로는 페널티.

  · 디테일
    - 라운드별 평가 (Excellent / Good / Clear)
    - 햅틱·사운드·화면 흔들림은 설정에서 켜고 끌 수 있어요.
    - 베스트 스코어 저장.

  빠른 한 판부터 도전적인 무한 모드까지, 자투리 시간에 두뇌를 자극하기 좋아요.
  ```
- **키워드**: `퍼즐,두뇌,길찾기,미니게임,캐주얼,한손,routy` (콤마 구분, 100자 제한)
- **지원 URL**: `https://routy-six.vercel.app/`
- **마케팅 URL**: 비워둠 (선택)

### 7-F. 스크린샷 업로드
- **6.7-inch Display (iPhone 15 Pro Max)**: `assets/appstore/screenshots/{01-home,02-speed,03-infinity}.png`
- 최소 3장 필요, 위 3장으로 충족

> 6.5-inch / 5.5-inch는 6.7-inch가 있으면 생략 가능 (App Store가 자동 리스케일)

### 7-G. 앱 아이콘
업로드 불필요 — 빌드에 포함된 `AppIcon.appiconset`에서 자동 추출됨. 5번 단계에서 교체했다면 그게 표시됨.

## 8. 빌드 업로드 (Archive)

Xcode → 상단 메뉴 **Product → Archive**:

1. 디바이스 선택: **Any iOS Device (arm64)** 로 변경 후 Archive
2. 빌드 완료되면 **Organizer** 창 자동 열림
3. **Distribute App** → **App Store Connect** → **Upload**
4. 옵션은 모두 기본값 (Manage Version and Build Number ON, Strip Swift symbols ON, Upload symbols ON)
5. 자동 서명 → **Upload** → 검증 후 App Store Connect로 전송 (5-15분)

업로드 후 App Store Connect의 **TestFlight** 탭에 빌드가 "Processing" 상태로 뜸 → 10-30분 내 "Ready to Submit"으로 변경.

## 9. 검토 요청

App Store Connect → 해당 앱 → **App Store** 탭 → 좌측 **iOS App** → 1.0 Prepare for Submission:

1. **Build**: 8번에서 업로드한 빌드 선택
2. **App Review Information**:
   - Contact: 본인 정보
   - **Demo Account**: 비워둠 (로그인 없음)
   - **Notes**: `로그인/네트워크 호출 없는 단일 플레이 퍼즐 게임입니다. 모든 데이터는 localStorage에 저장됩니다.`
3. **Version Release**: Automatically release (검토 통과 즉시 출시) 또는 Manually (수동 클릭 후 출시)
4. 우측 상단 **Add for Review** → 확인 → **Submit for Review**

⏱ Apple 검토 평균 1-2일. 처음 제출은 24-48시간 더 걸릴 수도.

## 10. 검토 통과 후 — Toss 콘솔에 URL 제출

App Store URL 형식: `https://apps.apple.com/kr/app/routy-길찾기퍼즐/id<숫자>`

이 URL을 **토스 콘솔 게임 등급 정보 필드**에 입력하면 한국 자체등급분류 증빙 충족.

## 11. 4.2 거절 가능성 대비

Apple은 "Minimum Functionality" 가이드라인(4.2)으로 단순 WebView 래퍼 앱을 거절할 수 있음. 우리 대응:

- ✅ 네이티브 햅틱 (`@capacitor/haptics`)
- ✅ 네이티브 상태바 색상 제어 (`@capacitor/status-bar`)
- ✅ Safe area를 통한 노치/Dynamic Island 대응
- ✅ Standalone 표시 모드 (브라우저 chrome 없음)
- ✅ Splash screen
- ✅ 오프라인 동작 가능 (Service Worker + 정적 자산)

거절될 경우 다음을 추가:
- 게임 자체에 iOS 네이티브 가치 (예: Game Center 점수판)
- Localization 설정 강화
- 거절 사유 응답에서 위 네이티브 기능 명시

## 12. 알아두면 좋을 사항

- **TestFlight 내부 테스트**는 별도 검토 없이 즉시 가능. 본인 Apple ID 추가만 하면 됨.
- **외부 TestFlight 테스트**(공개)는 별도 베타 앱 검토 필요 (보통 24h).
- **앱 출시 후 업데이트**: 동일 절차 반복, version code/name 증가.
- **번들 ID 변경 불가**: 한 번 정한 `com.routy.app`은 영구.

---

## 빠른 명령어 모음

```bash
# 매번 빌드 → 동기화 → Xcode 열기
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH"
npm run build:vite && npx cap sync ios && npx cap open ios

# 스크린샷 재캡처
npm run dev:vite &
npm run screenshots:appstore
```
