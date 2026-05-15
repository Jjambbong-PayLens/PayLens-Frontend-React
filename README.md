# PayLens React Frontend

Create React App 기반으로 변환한 PayLens 프론트엔드입니다.

```text
src/
 ├── assets/          # 이미지, 아이콘, 폰트 등 정적 에셋
 ├── components/      # 재사용 가능한 UI 컴포넌트
 │    ├── common/     # 버튼, 인풋, 모달 등 전역에서 공통으로 사용되는 UI
 │    ├── layout/     # 헤더, 푸터, 사이드바 등 페이지 레이아웃 요소
 │    └── payslip/    # 급여 명세서 업로드, 명세서 뷰어, 수동 검증 관련 도메인 컴포넌트
 │
 ├── pages/           # 라우터에 의해 렌더링되는 페이지 컴포넌트
 │    ├── Home/       # 서비스 소개 및 메인 랜딩 페이지
 │    ├── Upload/     # 급여 명세서 이미지 파일 업로드 페이지
 │    ├── Analysis/   # AI 임금 이상 탐지 및 교차 검증 결과 확인 페이지
 │    └── Manual/     # 사용자 수동 검증 및 데이터 수정 페이지
 │
 ├── api/             # 백엔드 및 AI 서버와의 통신을 위한 API 호출 함수
 │    ├── aiApi.ts    # AI 컴포넌트 데이터 연동
 │    └── authApi.ts  # 사용자 인증 및 권한 관리
 │
 ├── hooks/           # 비즈니스 로직 분리를 위한 커스텀 React Hooks
 │    └── usePayslip.ts # 명세서 데이터 처리 및 상태 관리 훅 등
 │
 ├── store/           # 전역 상태 관리
 │
 ├── styles/          # 전역 스타일링 설정 및 테마
 │
 ├── types/           # TypeScript 인터페이스 및 타입 정의
 │    └── payslip.d.ts # 급여 명세서 데이터 형식, API 응답 타입 등
 │
 ├── utils/           # 프로젝트 전반에서 사용되는 유틸리티 함수
 │    └── format.ts   # 금액 단위 콤마 처리, 날짜 포맷팅 등
 │
 ├── App.tsx          # 최상위 컴포넌트 및 글로벌 라우팅 설정
 └── index.tsx        # React 앱 진입점 및 렌더링

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
