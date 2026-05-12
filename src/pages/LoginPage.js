import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveAuth } from '../utils/auth';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const kakaoAuthUrl = useMemo(() => {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_KAKAO_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
      response_type: 'code',
    });

    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  }, []);

  const googleAuthUrl = useMemo(() => {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'email profile',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) return;

    const provider = sessionStorage.getItem('oauthProvider') || 'kakao';
    handleOAuthCallback(code, provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const startLogin = (provider) => {
    try {
      sessionStorage.setItem('oauthProvider', provider);

      if (provider === 'kakao') {
        window.location.href = kakaoAuthUrl;
        return;
      }

      window.location.href = googleAuthUrl;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOAuthCallback = async (code, provider) => {
    if (loading) return;

    setLoading(true);
    setMessage('로그인 처리 중입니다...');

    try {
      const apiUrl = provider === 'kakao'
        ? process.env.REACT_APP_KAKAO_LOGIN_API_URL
        : process.env.REACT_APP_GOOGLE_LOGIN_API_URL;

      const requestBody = {
        code: code
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok || data.isSuccess === false) {
        throw new Error(data.message || '로그인 API 호출에 실패했습니다.');
      }

      const result = data.result;

      if (!result?.accessToken) {
        throw new Error('응답에 accessToken이 없습니다.');
      }

      saveAuth(result);
      sessionStorage.removeItem('oauthProvider');
      navigate('/dashboard', { replace: true });
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