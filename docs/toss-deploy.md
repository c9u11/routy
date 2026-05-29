# 토스 미니앱(앱인토스) 배포 워크플로

## 출시용 메타데이터 (콘솔 입력값 초안)

### 기본 정보
- **앱 이름**: 길찾기 퍼즐
- **appName(scheme)**: `routy` (`intoss://routy`)
- **부제**: 손가락으로 잇는 미니 두뇌 퍼즐
- **앱 유형**: 게임
- **장르**: 퍼즐 / 캐주얼
- **사용 연령**: 전체 이용가
- **고객센터 이메일**: <개발자 본인 이메일로 채울 것>

### 상세 설명 (초안)

```
시작에서 도착까지, 한 번의 드래그로 잇는 길찾기 퍼즐.

· 두 가지 모드
  - Speed: 제한 시간 안에 최장 경로를 찾아 점수를 쌓아요.
  - Infinity: 목숨 3개로 끝없이 도전. 트리거를 모두 거치며 가장 먼 길을 찾아내야 살아남아요.

· 핵심 규칙
  - 노드를 많이 지날수록 점수가 제곱으로 늘어요 (waypoints²).
  - 방해물은 인접한 트리거 칸을 거치면 통과할 수 있어요.
  - 최장 경로로 클리어하면 점수 보너스. 짧은 경로는 페널티.

· 디테일
  - 라운드별 평가 (Excellent / Good / Clear)
  - 햅틱·사운드·화면 흔들림은 설정에서 켜고 끌 수 있어요.
  - 베스트 스코어 저장.

빠른 한 판부터 도전적인 무한 모드까지, 자투리 시간에 두뇌를 자극하기 좋아요.
```

### 시각 자산 — 사이즈 규격

| 자산 | 규격 | 비고 |
|---|---|---|
| 앱 로고 | **600×600 PNG, 단색 배경, 투명 X** | `assets/console/icon-600.png` 사용 (이 저장소에 포함) |
| 썸네일 | 1932×828 PNG | **별도 마케팅 이미지 — 디자인 필요** |
| 스크린샷(세로) | 636×1048 PNG | 최소 3장 — 실제 게임플레이 캡처 |
| 스크린샷(가로) | 1504×741 PNG | 또는 가로 최소 1장 |

스크린샷은 실기 또는 토스 샌드박스 미리보기에서 캡처해 콘솔 업로드. 캡처 권장 화면:
1. 홈 (모드 선택)
2. Speed 게임 플레이 중 (드래그 경로)
3. Infinity 게임 플레이 중 (목숨 + HUD)
4. RoundRatingToast (Excellent / 완벽!)
5. GameOver 화면

## 출시 체크리스트

| 항목 | 상태 |
|---|---|
| `granite.config.ts` 작성 | ✅ (icon URL은 콘솔 업로드 후 반영) |
| `.ait` 빌드 성공 (`npm run build`) | ✅ |
| 핀치줌 차단 (`maximum-scale=1, user-scalable=no`) | ✅ |
| viewport `viewport-fit=cover` | ✅ |
| `theme-color` 메타 | ✅ |
| 600×600 앱 로고 PNG | ✅ `assets/console/icon-600.png` |
| 1932×828 썸네일 | ⏳ 디자인 필요 |
| 스크린샷 3장 이상 | ⏳ 실기 캡처 필요 |
| 개인정보처리방침 URL | ⏳ — 본문은 `docs/privacy.md`에 작성. 깃허브 페이지 / 정적 호스팅 후 URL 콘솔 입력 |
| 광고/결제 사용 여부 | 미사용 — 콘솔에 명시 |
| 외부 API 사용 여부 | 없음 (모든 로직이 클라이언트 측) |
| 토스 로그인/계정 데이터 사용 | 사용 안 함 |
| 앱 번들 100MB 이하 | ✅ (현재 3.7MB) |
| 출시 정책(`/intro/guide`) 검토 | ⏳ 사용자 확인 |

## 출시 정책 준수 (Routy 기준)

| 정책 영역 | Routy 상태 | 비고 |
|---|---|---|
| 디지털 자산/NFT | ❌ 미사용 | |
| 자금 세탁/현금 환전 | ❌ 미사용 | |
| 도박/베팅 요소 | ❌ 미사용 | 점수 게임만 |
| 금융 상품 중개 | ❌ 미사용 | |
| 의료/병원 예약 | ❌ 미사용 | |
| 토스 로그인 외 로그인 | 사용 안 함 | 계정 없음 |
| 외부 광고 네트워크 | 사용 안 함 | 향후 토스 네이티브 광고 도입 가능 |
| 자사 앱 설치 유도 | 없음 | |
| 외부 링크 | 없음 | |
| 동일 브랜드 다중 출시 | 해당 없음 | 단일 미니앱 |

## 출시 흐름

1. **콘솔 메타 입력**: 위 메타데이터 초안 기반으로 콘솔 필드 채우기. 아이콘 PNG 업로드.
2. **아이콘 URL 반영**: 콘솔이 발급한 아이콘 URL을 `granite.config.ts`의 `brand.icon`에 채우고 재빌드.
3. **토큰 등록**: `node_modules/.bin/ait token add --api-key <KEY> default`
4. **`.ait` 빌드 & 배포**: `npm run build` → `npm run deploy` (또는 콘솔 수동 업로드)
5. **샌드박스 테스트**: 토스 앱 샌드박스에서 deploymentId로 실기 검증
6. **검토 요청**: 콘솔 > "검토 요청하기" (테스트 1회 이상 완료 후)
7. **승인 대기**: 영업일 기준 최대 3일, 결과는 이메일
8. **출시**: 콘솔 > "출시하기"



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
