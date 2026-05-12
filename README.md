# PayLens React Frontend

Create React App 기반으로 변환한 PayLens 프론트엔드입니다.

## 실행

```bash
npm install
cp .env.example .env
npm start
```

Windows 기준 `npm start`는 `localhost:3000`으로 실행됩니다.
Mac/Linux에서는 다음 명령을 사용할 수 있습니다.

```bash
npm run start:mac
```

## OAuth Redirect URI

카카오/구글 개발자 콘솔에 아래 주소를 등록하세요.

```text
http://localhost:3000/login
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
