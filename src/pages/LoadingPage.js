import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/result', { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="page-card center-card">
      <div className="spinner" />
      <h2>AI가 임금 정보를 분석 중입니다.</h2>
      <p>잠시만 기다려주세요.</p>
    </section>
  );
}

export default LoadingPage;
