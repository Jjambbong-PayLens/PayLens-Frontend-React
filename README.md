# ⚖️ PayLens (페이렌즈) - Frontend
> **외국인 근로자를 위한 AI 기반 임금체불 분석 및 권리 구제 지원 플랫폼**

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
</p>

---

## 🚀 서비스 개요 (Service Overview)

**PayLens Frontend**는 언어 장벽과 복잡한 노동법으로 인해 권리 구제의 사각지대에 놓인 외국인 근로자가 직관적이고 쾌적하게 서비스를 이용할 수 있도록 설계된 **React 기반 웹사이트**입니다. 

다국어 지원 인프라(`i18n`)를 전역에 구축하여 실시간 언어 스위칭을 구현하였습니다.

---

## ✨ 핵심 프론트엔드 기능 (Key Client Features)

- **실시간 다국어 인프라 & 글로벌 UI**: `react-i18next`를 전역 레이아웃에 결합하여 한국어, 영어, 베트남어 간의 유연한 실시간 언어 전환을 지원합니다.
- **다국어 노무 전문 용어 사전 (Smart Glossary)**: 계약, 임금, 체류 관련 **193개의 전문 용어 사전**을 제공합니다.

---

## 🏗 디렉토리 아키텍처 (Directory Architecture)

```text
src/
 ├── components/              # 도메인 및 UI 단위로 분리된 재사용 가능한 컴포넌트
 │    ├── LanguageModal.js    # 전역 다국어 설정을 위한 언어 선택 모달 창
 │    ├── Layout.js           # 대시보드 및 분석 기능을 위한 사이드바/탑바 레이아웃
 │    ├── MainDropdown.js     # MainLayout 헤더의 더보기 메뉴 드롭다운
 │    ├── MainLayout.js       # 서비스 메인 및 소개 페이지용 상단 네비게이션(GNB) 레이아웃
 │    └── RequireAuth.js      # 라우터 접근 권한 제어 (JWT 토큰 기반 로그인 검증)
 │
 ├── locales/                 # 다국어(i18n) 실시간 전환을 위한 언어별 JSON 번역 데이터
 │    ├── en.json             # 영어(English) 번역 데이터
 │    ├── ko.json             # 한국어(Korean) 번역 데이터
 │    └── vi.json             # 베트남어(Vietnamese) 번역 데이터
 │
 ├── pages/                   # 라우팅 엔드포인트 역할을 하는 페이지 컴포넌트
 │    ├── MainPage.js         # 서비스 메인 랜딩 페이지 (Abnormal Processing 소개 및 시작 유도)
 │    ├── ExplainPage.js      # 서비스 주요 기능(AI 분석, 법률 상담 등) 가이드 및 사용 방법 안내
 │    ├── PricePage.js        # 구독 플랜(일반/특화/프리미엄) 안내 및 결제 유도
 │    ├── LoginPage.js        # 사용자 인증 페이지 (Kakao, Google OAuth 2.0 소셜 로그인 연동)
 │    ├── DashboardPage.js    # 사용자 맞춤형 관제 대시보드 (분석 시작 및 결과 보기 네비게이션)
 │    ├── PreAnalysisPage.js  # AI 분석 전 필수 4대 법적 기준(상시 5인, 주 15시간 등) 체크 문진
 │    ├── AnalysisPage.js     # 급여명세서(PDF) Drag & Drop 업로드 및 다중 파일 AI 분석 요청
 │    ├── LoadingPage.js      # AI 서버 임금 데이터 분석 대기 시 제공되는 로딩 화면 (1.2s 지연)
 │    ├── ResultPage.js       # AI 교차 검증을 통한 최종 임금체불 분석 리포트 결과 안내 페이지
 │    ├── PaymentPage.js      # 상세 PDF 분석 리포트 발급을 위한 결제 진행 화면
 │    ├── NewsPage.js         # 다국어 기반 PayLens Insights 최신 노무 소식 피드
 │    ├── GlossaryPage.js     # 193개 노동/급여 용어 정의 및 예시 다국어 사전
 │    └── MyPage.js           # 프로필 개요, 결제/영수증 내역, 문서 보관함 및 계정 관리(회원탈퇴)
 │
 ├── styles/                  # 프로젝트 전반에서 사용되는 스타일 모듈
 │    └── global.css          # CSS Grid/Flex 기반의 반응형 레이아웃 및 브랜드 컬러 정의
 │
 ├── utils/                   # 외부 서버 및 AI 인프라 통신 캡슐화 모듈
 │    ├── api.js              # Axios 전역 인스턴스 (BaseURL 설정 및 JWT 토큰 자동 주입 Interceptor)
 │    ├── auth.js             # 로컬 스토리지 기반 인증 제어 (Token 발급/조회, 사용자 정보 관리, 로그아웃)
 │    ├── documentApi.js      # PDF 문서 업로드 및 AI 분석 통신 파이프라인 (Fetch API 기반)
 │    │                       - requestUploadUrls: AWS S3 Presigned URL 발급 요청
 │    │                       - uploadFilesToS3: 프론트엔드 -> S3 클라이언트 직접 업로드
 │    │                       - analyzeDocumentsTogether: Gemini AI를 활용한 업로드 문서 통합 분석
 │    ├── lang.js             # 사용자 선호 언어 설정 API (DB 연동을 통해 AI 분석 리포트 출력 언어에 반영)
 │    └── surveyApi.js        # 임금 체불 검토를 위한 4대 문진(사전 분석 질문) 결과 전송 및 저장
 │
 ├── App.js                   # 최상위 컴포넌트 및 중첩 라우팅(Nested Routing) 설정
 ├── i18n.js                  # react-i18next 초기화 설정 (UI 다국어 실시간 전환 엔진)
 └── index.js                 # React 앱 진입점
```
---

 ## 👥 프론트엔드 팀원 및 역할 (Team Jjambbong)

| 한수민 | 정현준 | 
| :---: | :---: | 
| <img src="https://github.com/github.png" width="100"> | <img src="https://avatars.githubusercontent.com/u/192002975?v=4" width="100">
| [@2024125085](https://github.com/2024125085) | [@MungOMung1](https://github.com/MungOMung1) | 
| **FE** | **FE** |

*(※ 프론트엔드 및 각 세부 파트 기여도는 레포지토리 커밋 내역을 참고해 주세요.)*

---

## ⚙️ 실행 및 로컬 환경 설정 (Getting Started)

프로젝트를 로컬 환경에서 실행하기 위한 방법입니다.

### 패키지 설치 및 실행
```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 서버 실행
npm start
