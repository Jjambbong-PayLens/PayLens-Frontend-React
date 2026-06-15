import React, { useState } from 'react'; // 1. useState 추가
import { useNavigate, Link } from 'react-router-dom'; // 2. useNavigate 추가
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import api from '../utils/api'; // 3. api 추가

function DashboardPage() {
  const user = getUser();
  const { t } = useTranslation();
  const navigate = useNavigate(); // 4. navigate 훅 사용
  const [isNavigating, setIsNavigating] = useState(false); // 5. 로딩 상태 관리

  // 🌟 [핵심] 가장 최근 리포트를 가져와 이동하는 함수
  const handleViewLatestAnalysis = async () => {
    try {
      setIsNavigating(true);
      // 1. 모든 분석 리포트 목록을 조회
      const response = await api.get('/api/analyses');
      const analyses = response.data.result || [];

      if (analyses.length === 0) {
        alert(t('DashboardPage_alert_no_analysis', '아직 분석 기록이 없습니다.'));
        return;
      }

      // 2. 생성일자(createdAt) 기준 내림차순 정렬하여 가장 최근 항목 선택
      const latestAnalysis = [...analyses].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      // 3. 해당 ID의 상세 정보 조회
      const detailResponse = await api.get(`/api/analyses/${latestAnalysis.analysisId}`);
      
      // 4. ResultPage로 데이터 전달하며 이동
      navigate(`/result/${latestAnalysis.analysisId}`, { 
        state: { analysisResult: detailResponse.data.result.result || detailResponse.data.result } 
      });
    } catch (error) {
      console.error("최신 분석 결과 로드 실패:", error);
      alert(t('DashboardPage_alert_error', '결과를 불러오는 데 실패했습니다.'));
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <section className="page-card hero-card">
      <p className="eyebrow">Dashboard</p>
      <h2>{user?.username || '사용자'}{t('DashboardPage_user-fallback')}</h2>
      <p>{t('DashboardPage_description')}</p>
      <div className="button-row">
        <Link className="primary-link" to="/preanalysis">{t('DashboardPage_btn-start')}</Link>
        
        {/* 🌟 [수정] Link 대신 버튼을 사용하여 함수 호출 */}
        <button 
          className="secondary-link" 
          onClick={handleViewLatestAnalysis}
          disabled={isNavigating}
          style={{ cursor: 'pointer' }}
        >
          {isNavigating ? t('DashboardPage_btn-loading', '불러오는 중...') : t('DashboardPage_btn-result')}
        </button>
      </div>
    </section>
  );
}

export default DashboardPage;