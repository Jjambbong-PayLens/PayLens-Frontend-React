import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';

function DashboardPage() {
  const user = getUser();

  return (
    <section className="page-card hero-card">
      <p className="eyebrow">Dashboard</p>
      <h2>{user?.username || '사용자'}님, 임금 분석을 시작해보세요.</h2>
      <p>
        PayLens는 급여명세서, 근로시간, 계약 정보를 기반으로 임금 이상 여부를 확인하는 서비스입니다.
      </p>
      <div className="button-row">
        <Link className="primary-link" to="/preanalysis">분석 시작</Link>
        <Link className="secondary-link" to="/result">결과 보기</Link>
      </div>
    </section>
  );
}

export default DashboardPage;
