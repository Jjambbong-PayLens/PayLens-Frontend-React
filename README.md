# PayLens React Frontend

Create React App 기반으로 변환한 PayLens 프론트엔드입니다.

```text
src/
 ├── components/              = 도메인 및 UI 단위로 분리된 재사용 가능한 컴포넌트
 │    ├── Layout.js           # [Private] 대시보드 및 분석 기능을 위한 사이드바/탑바 레이아웃
 │    ├── MainLayout.js       # [Public] 서비스 소개 및 랜딩 페이지를 위한 상단 네비게이션 레이아웃
 │    └── RequireAuth.js      # 라우터 접근 권한 제어 (JWT 토큰 기반 로그인 검증)
 ├── pages/                   = 외부 서버 및 AI 인프라 통신 모듈
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
 │    └── MyPage.js           # 프로필 개요, 결제/영수증 내역, 문서 보관함 및 계정 관리(회원탈퇴)
 ├── styles/                  = 프로젝트 전반에서 사용되는 헬퍼 함수
 │    └── global.css          # CSS Grid/Flex 기반의 반응형 레이아웃 및 브랜드 컬러 정의
 ├── utils/
 │    ├── api.js              # Axios 전역 인스턴스 (BaseURL 설정 및 JWT 토큰 자동 주입 Interceptor)
 │    ├── auth.js             # 로컬 스토리지 기반 인증 제어 (Token 발급/조회, 사용자 정보 관리, 로그아웃)
 │    ├── documentApi.js      # PDF 문서 업로드 및 AI 분석 통신 파이프라인 (Fetch API 기반)
 │    │                       - requestUploadUrls: AWS S3 Presigned URL 발급 요청
 │    │                       - uploadFilesToS3: 프론트엔드 -> S3 클라이언트 직접 업로드 (서버 부하 감소)
 │    │                       - analyzeDocumentsTogether: Gemini AI를 활용한 업로드 문서 통합 분석
 │    └── surveyApi.js        # 임금 체불 검토를 위한 4대 문진(사전 분석 질문) 결과 전송 및 저장
 ├── App.js                   # 최상위 컴포넌트 및 중첩 라우팅(Nested Routing) 설정
 └── index.js                 # React 앱 진입점
```

## 실행

```bash
npm install
npm start
```

Windows 기준 `npm start`는 `localhost:3000`으로 실행됩니다.
Mac/Linux에서는 다음 명령을 사용할 수 있습니다.

```bash
npm run start:mac
```

## 로그인 API 응답 구조

다음 구조를 기준으로 accessToken을 저장합니다.

```json
{
  "isSuccess": true,
  "result": {
    "accessToken": "...",
    "id": 4,
    "providerId": "4836616610",
    "role": "USER",
    "username": "김동현"
  }
}
```
