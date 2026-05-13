import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveAuth } from '../utils/auth';

function getRequiredEnv(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key}가 .env에 없습니다.`);
  }

  return value;
}

function getOAuthConfig(provider) {
  if (provider === 'kakao') {
    return {
      clientId: getRequiredEnv('REACT_APP_KAKAO_CLIENT_ID'),
      redirectUri: getRequiredEnv('REACT_APP_KAKAO_REDIRECT_URI'),
      loginApiUrl: getRequiredEnv('REACT_APP_KAKAO_LOGIN_API_URL'),
      authBaseUrl: 'https://kauth.kakao.com/oauth/authorize',
      extraParams: {},
    };
  }

  return {
    clientId: getRequiredEnv('REACT_APP_GOOGLE_CLIENT_ID'),
    redirectUri: getRequiredEnv('REACT_APP_GOOGLE_REDIRECT_URI'),
    loginApiUrl: getRequiredEnv('REACT_APP_GOOGLE_LOGIN_API_URL'),
    authBaseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    extraParams: {
      scope: 'email profile',
    },
  };
}

function buildAuthUrl(provider) {
  const config = getOAuthConfig(provider);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    ...config.extraParams,
  });

  return `${config.authBaseUrl}?${params.toString()}`;
}

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) return;

    if (calledRef.current) {
      console.log('이미 로그인 API를 호출했습니다. 중복 요청을 차단합니다.');
      return;
    }

    calledRef.current = true;

    const provider = sessionStorage.getItem('oauthProvider') || 'kakao';
    handleOAuthCallback(code, provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const startLogin = (provider) => {
    try {
      const authUrl = buildAuthUrl(provider);
      const config = getOAuthConfig(provider);

      console.log('========== OAuth 로그인 시작 ==========' );
      console.log('provider:', provider);
      console.log('redirectUri:', config.redirectUri);
      console.log('authUrl:', authUrl);
      console.log('======================================' );

      sessionStorage.setItem('oauthProvider', provider);
      window.location.href = authUrl;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOAuthCallback = async (code, provider) => {
    if (loading) return;

    setLoading(true);
    setMessage('로그인 처리 중입니다...');

    try {
      const config = getOAuthConfig(provider);
      const requestBody = { code };

      console.log('========== 백엔드 로그인 요청 확인 ==========');
      console.log('provider:', provider);
      console.log('apiUrl:', config.loginApiUrl);
      console.log('redirectUri:', config.redirectUri);
      console.log('requestBody:', requestBody);
      console.log('JSON body:', JSON.stringify(requestBody));
      console.log('==========================================');

      const response = await fetch(config.loginApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log('========== 백엔드 로그인 응답 확인 ==========');
      console.log('response status:', response.status);
      console.log('response ok:', response.ok);
      console.log('response data:', data);
      console.log('==========================================');

      if (!response.ok || data.isSuccess === false) {
        throw new Error(data.message || '로그인 API 호출에 실패했습니다.');
      }

      const result = data.result;

      if (!result?.accessToken) {
        throw new Error('응답에 accessToken이 없습니다.');
      }

      saveAuth(result);
      sessionStorage.removeItem('oauthProvider');
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
      setMessage(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="login-logo">PayLens</div>
        <h1>외국인 근로자를 위한<br />AI 임금 분석 서비스</h1>
        <p className="login-description">
          급여명세서와 근로 정보를 바탕으로 임금 체불 가능성을 분석합니다.
        </p>

        <div className="login-actions">
          <button type="button" className="kakao-button" onClick={() => startLogin('kakao')} disabled={loading}>
            카카오로 시작하기
          </button>
          <button type="button" className="google-button" onClick={() => startLogin('google')} disabled={loading}>
            구글로 시작하기
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}
      </section>
    </div>
  );
}

export default LoginPage;
