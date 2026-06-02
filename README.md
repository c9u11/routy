<div align="center">

# 🧩 Routy — 길찾기 퍼즐 (Path Puzzle)

**시작에서 도착까지, 한 번의 드래그로 잇는 미니 두뇌 퍼즐**

손가락을 떼지 않고 모든 칸을 지나 도착점까지 — 한 줄로 길을 이어보세요.

[![App Store](https://img.shields.io/badge/App_Store-다운로드-0D96F6?logo=apple&logoColor=white)](https://apps.apple.com/kr/app/길찾기-퍼즐/id6774656806)
[![Live](https://img.shields.io/badge/Web-routy--six.vercel.app-1677ff)](https://routy-six.vercel.app/)
![Rating](https://img.shields.io/badge/연령등급-전체이용가-2ea44f)
![Price](https://img.shields.io/badge/가격-무료-lightgrey)

</div>

---

## 🎮 소개

**Routy(길찾기 퍼즐)** 는 규칙이 단순한 한붓그리기 퍼즐이에요.
시작점에서 손가락을 떼지 않고, 보드의 모든 칸을 지나 도착점까지 이어지는 길을 그리면 됩니다.
쉬워 보이지만 한 수만 틀려도 막다른 길에 갇혀요.

## 🕹️ 게임 모드

| 모드 | 설명 |
|------|------|
| ⚡ **스피드 (Speed)** | 제한 시간 안에 빠르게 길을 완성하는 모드. 순발력과 직관이 핵심 |
| ♾️ **인피니티 (Infinity)** | 생명을 걸고 끝없이 이어지는 퍼즐에 도전. 한 번의 실수가 치명적 |

## ✨ 특징

- 🌗 **라이트 / 다크 모드** 지원
- 🌐 **한국어 / English** (i18n)
- 📳 **햅틱 피드백** — 손맛까지 살린 진동 반응
- 🚫 **광고 없음 · 인앱결제 없음 · 로그인 불필요**

## 📱 플랫폼

| 플랫폼 | 상태 | 비고 |
|--------|------|------|
| **iOS** | ✅ 출시됨 | [App Store](https://apps.apple.com/kr/app/길찾기-퍼즐/id6774656806) (Capacitor 네이티브 셸) |
| **Apps-in-Toss 미니앱** | 🛠️ 준비 중 | 토스 미니앱(Granite) |
| **Android** | 🌐 PWA / TWA | Vercel 호스팅 웹앱을 TWA로 래핑 |

> 같은 웹 코드베이스 하나로 세 플랫폼에 배포됩니다.

## 🛠️ 기술 스택

- **React 19** + **TypeScript** + **Vite**
- **Capacitor** — iOS 네이티브 셸 (햅틱·상태바 제어)
- **@apps-in-toss/web-framework** (Granite) — 토스 미니앱 연동
- **Vercel** — 웹 호스팅 (PWA / TWA 소스)

## 🚀 개발

```bash
npm install        # 의존성 설치
npm run dev:vite   # 로컬 웹 개발 서버 (Vite)
```

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 토스(Granite) 개발 서버 |
| `npm run dev:vite` | Vite 웹 개발 서버 |
| `npm run build:vite` | 웹 프로덕션 빌드 (tsc + vite) |
| `npm run build` | 토스 미니앱 번들 빌드 (`ait build`) |
| `npm run deploy` | 토스 미니앱 배포 (`ait deploy`) |
| `npm run ios:open` | 빌드 + 동기화 후 Xcode 열기 |
| `npm run icons` | 앱 아이콘 일괄 생성 |
| `npm run screenshots` | 스토어 스크린샷 생성 |

## 📂 프로젝트 구조

```
src/
├── App.tsx          # 앱 진입점
├── components/      # UI 컴포넌트
├── hooks/           # 커스텀 훅
├── i18n/            # 한국어/영어 번역
├── theme/           # 라이트/다크 테마
├── utils/           # 저장소·햅틱·토스 환경 등 유틸
└── types/           # 타입 정의
public/              # PWA 매니페스트, 아이콘, 서비스 워커, 개인정보처리방침
ios/                 # Capacitor iOS 프로젝트
assets/              # 콘솔/스토어용 그래픽·스크린샷
scripts/             # 아이콘·스크린샷 생성 스크립트
```

## 🔗 링크

- 📲 **App Store**: https://apps.apple.com/kr/app/길찾기-퍼즐/id6774656806
- 🌐 **웹(라이브)**: https://routy-six.vercel.app/
- 🔒 **개인정보처리방침**: https://routy-six.vercel.app/privacy.html

---

<div align="center">

Made by **SEOKYOUNG HWANG** · © Routy

</div>
