# ⚖️ PayLens (페이렌즈) - Frontend
> **외국인 근로자를 위한 AI 기반 임금체불 분석 및 권리 구제 지원 플랫폼**

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white" alt="i18next"/>
  <img src="https://img.shields.io/badge/AWS_S3-569A31?style=flat-square&logo=amazons3&logoColor=white" alt="AWSS3"/>
</p>

---

## 🚀 서비스 개요 (Service Overview)

**PayLens Frontend**는 언어 장벽과 복잡한 노동법으로 인해 권리 구제의 사각지대에 놓인 외국인 근로자가 직관적이고 쾌적하게 서비스를 이용할 수 있도록 설계된 **React 기반 웹 애플리케이션**입니다. 

다국어 지원 인프라(`i18n`)를 전역에 구축하여 실시간 언어 스위칭을 구현했으며, 대용량 증빙 문서 업로드의 백엔드 부하를 최소화하기 위해 AWS S3 Presigned URL 파이프라인을 클라이언트 단에 구축했습니다.

---

## ✨ 핵심 프론트엔드 기능 (Key Client Features)

- **실시간 다국어 인프라 & 글로벌 UI**: `react-i18next`를 전역 레이아웃에 결합하여 한국어, 영어, 베트남어 간의 화면 깜빡임 없는 유연한 실시간 언어 전환을 지원합니다.
- **다국어 노무 전문 용어 사전 (Smart Glossary)**: 계약, 임금, 체류 관련 **193개의 전문 용어 사전**을 제공합니다. 렌더링 최적화를 위해 데이터는 독립 키값(`defKey`, `exKey`) 구조로 추상화하여 실시간 현지화를 보장합니다.
- **인프라 부하 절감을 위한 S3 클라이언트 직접 업로드**: 대용량 PDF 급여 증빙 파일 처리 시, 백엔드 서버의 I/O 병목을 원천 차단하기 위해 2단계 파이프라인을 구축했습니다.
  1. `documentApi.js`가 백엔드에 Presigned URL 임시 업로드 권한을 먼저 획득
  2. 프론트엔드가 AWS S3 버킷에 **직접 이진(Binary) 데이터를 푸시**
- **구조화된 라우팅 보호 (RequireAuth & Layouts)**: `Public Layout`과 `Private Layout`으로 레이아웃 계층을 이원화했습니다. `RequireAuth` 고차 컴포넌트가 JWT 토큰 세션을 검증하여 비인가 접근을 원천 차단합니다.

---

## 🏗 디렉토리 아키텍처 (Directory Architecture)

```text
src/
 ├── components/              # 도메인 및 UI 단위로 분리된 재사용 가능한 컴포넌트
 │    ├── Layout.js           # [Private] 대시보드 및 분석 기능을 위한 사이드바/탑바 레이아웃
 │    ├── MainLayout.js       # [Public] 서비스 소개 및 랜딩 페이지를 위한 상단 네비게이션 레이아웃
 │    └── RequireAuth.js      # 라우터 접근 권한 제어 (JWT 토큰 기반 로그인 검증)
 │
 ├── pages/                   # 라우팅 엔드포인트 역할을 하는 페이지 컴포넌트
 │    │                       # [Public]
 │    ├── MainPage.js         # 서비스 메인 랜딩 페이지 (Abnormal Processing 소개 및 시작 유도)
 │    ├── Explain.js          # 서비스 주요 기능(AI 분석, 법률 상담 등) 및 4단계 사용 방법 안내
 │    ├── PricePage.js        # 구독 플랜(일반/특화/프리미엄) 안내 및 결제 유도
 │    ├── LoginPage.js        # 사용자 인증 페이지 (Kakao, Google OAuth 2.0 소셜 로그인 연동)
 │    │                       # [Private]
 │    ├── DashboardPage.js    # 사용자 맞춤형 대시보드 (분석 시작 및 결과 보기 네비게이션)
 │    ├── PreAnalysisPage.js  # AI 분석 전 필수 4대 법적 기준(상시 5인, 주 15시간 등) 체크 문진
 │    ├── AnalysisPage.js     # 급여명세서(PDF) Drag & Drop 업로드 및 다중 파일 AI 분석 요청
 │    ├── LoadingPage.js      # AI 서버 임금 데이터 분석 대기 시 제공되는 로딩 화면 (1.2s 지연)
 │    ├── PaymentPage.js      # 상세 PDF 분석 리포트 발급을 위한 결제 진행 화면
 │    ├── NewsPage.js         # 다국어 기반 PayLens Insights 최신 소식 피드
 │    ├── GlossaryPage.js     # 193개 노동/급여 용어 정의 및 예시 다국어 사전
 │    └── MyPage.js           # 프로필 개요, 결제/영수증 내역, 문서 보관함 및 계정 관리(회원탈퇴)
 │
 ├── public/locales/          # [다국어 데이터] 각 언어별 JSON 번역 파일 (ko, en, vi 등)
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
 │    └── surveyApi.js        # 임금 체불 검토를 위한 4대 문진(사전 분석 질문) 결과 전송 및 저장
 │
 ├── App.js                   # 최상위 컴포넌트 및 중첩 라우팅(Nested Routing) 설정
 └── index.js                 # React 앱 진입점

 ## 👥 프론트엔드 팀원 및 역할 (Team Jjambbong)

| 한수민 | 정현준 | 
| :---: | :---: | 
| <img src="https://github.com/dh1180.png" width="100"> | <img src="https://github.com/github.png" width="100"> | <img src="https://github.com/github.png" width="100"> | <img src="https://github.com/github.png" width="100"> |
| [@dh1180](https://github.com/dh1180) | [@github](https://github.com) | [@github](https://github.com) | [@github](https://github.com) |
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