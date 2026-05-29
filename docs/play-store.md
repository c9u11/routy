# Google Play Store 배포 진행 상황

> 상태: **일시 보류** (App Store 경로로 우회). 추후 재개 시 이 문서를 따라가면 됨.

## 목적

토스 미니앱 출시에 필요한 "등급분류증명서"를 Google Play(자체등급분류 사업자)의 Play Store URL로 대체. App Store와 병행 또는 단독으로 사용 가능.

## 완료된 작업 (코드 + 자산)

### PWA 인프라
- `public/manifest.webmanifest` — 표준 PWA manifest (한국어, standalone, brand colors)
- `public/sw.js` — 최소 service worker (PWA installable 요건 충족용)
- `src/main.tsx` — 프로덕션 환경에서 SW 등록
- `index.html` — `<link rel="manifest">` 추가
- `public/icon-192.png`, `public/icon-512.png` — manifest 참조 아이콘
- Vercel `/manifest.webmanifest`, `/sw.js`, `/icon-512.png` 모두 정상 서빙 확인됨

### Digital Asset Links
- `public/.well-known/assetlinks.json` — **실제 SHA-256 fingerprint 반영 완료**
  - `package_name`: `com.routy.app`
  - `sha256`: `DF:D4:D9:EB:43:84:E6:62:38:A2:F2:FF:CE:19:95:23:2A:E3:BA:72:3D:A1:2D:8B:7E:15:BB:FC:37:66:B6:7F`
- Vercel 배포되어 `https://routy-six.vercel.app/.well-known/assetlinks.json`에서 접근 가능

### PWABuilder로 패키지 생성됨
- 도구: https://www.pwabuilder.com/
- 입력: `https://routy-six.vercel.app/`
- 생성된 파일 위치(로컬, **gitignore됨**): `Routy - Google Play package/`
  - `길찾기 퍼즐.apk` — 테스트 설치용
  - `길찾기 퍼즐.aab` — **Play Console 업로드용**
  - `signing.keystore` — 서명 키 (절대 분실 금지)
  - `signing-key-info.txt` — 비밀번호 포함 (키스토어 백업 시 함께)
  - `assetlinks.json` — 참고용 (실제 배포는 `public/.well-known/`)
  - `Readme.html` — PWABuilder 안내

### 서명 키 정보
- **Keystore password**: `IjaB7zGesGkp` (PWABuilder 자동 생성)
- **Key alias**: `routy`
- **Key password**: `IjaB7zGesGkp` (same)
- **Signer CN/O/OU/C**: `Routy / Routy / Engineering / KR`
- ⚠️ 키스토어 파일 분실 시 같은 패키지명으로 Play 업데이트 불가. `signing.keystore` 별도 안전한 곳에 백업 권장.

## 남은 작업 (재개 시 이곳부터)

### 1. Play Console 가입 ($25 일회성)
- https://play.google.com/console
- 개인 계정 권장 (조직은 D-U-N-S 번호 필요)
- 신분증으로 신원 인증, 검토 1-2일

### 2. 앱 생성 + AAB 업로드
1. 콘솔 → "앱 만들기"
   - 앱 이름: `길찾기 퍼즐`
   - 기본 언어: 한국어
   - 앱 또는 게임: 게임
   - 무료
2. 좌측 메뉴 → 테스트 → **내부 테스트** → 새 버전
3. AAB 업로드: `Routy - Google Play package/길찾기 퍼즐.aab`

### 3. 콘텐츠 등급 설문
- 정책 → 콘텐츠 등급 설문 (모든 항목 "아니오")
- → **모든 지역 전체이용가** 부여

### 4. 필수 메타 입력
| 필드 | 값 |
|---|---|
| 개인정보처리방침 URL | `https://routy-six.vercel.app/privacy.html` |
| 앱 카테고리 | 게임 > 퍼즐 |
| 광고 포함 여부 | 광고 없음 |
| 데이터 보안 | 데이터 수집 없음 |
| 앱 아이콘 | `assets/console/icon-600.png` |
| 그래픽 자산 | `assets/console/thumbnail-1932x828.png` 등 |
| 스크린샷 | `assets/console/screenshots/*.png` (16:9 비율 변환 필요할 수 있음) |

### 5. 내부 테스트 출시
- 트랙 출시 → 본인 Google 계정 이메일을 테스터로 등록
- 공유 가능한 링크 발급 → 이 URL을 토스 콘솔 게임 등급 정보 필드에 제출

## TWA 동작 확인 방법 (선택, 디바이스 있을 때)
1. APK를 안드로이드 폰에 설치 (`adb install` 또는 직접 전송)
2. 첫 실행 시 Digital Asset Links 검증
   - 검증 통과 → 풀화면 (주소창 없음)
   - 검증 실패 → Chrome Custom Tabs (주소창 표시) → assetlinks.json fingerprint 확인 필요

## 참고
- Bubblewrap CLI는 한 번 시도했으나 대화형 프롬프트 자동화 실패로 중단. PWABuilder로 전환 완료.
- 추후 버전 업데이트 시: PWABuilder 재실행 (versionCode 증가) 또는 keystore 재사용해 수동 빌드.
