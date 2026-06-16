import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function DashboardPage() {
  const user = getUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewLatestAnalysis = async () => {
    try {
      setIsNavigating(true);
      const response = await api.get('/api/analyses');
      const analyses = response.data.result || [];

      if (analyses.length === 0) {
        alert(t('DashboardPage_alert_no_analysis', '아직 분석 기록이 없습니다.'));
        return;
      }

      const latestAnalysis = [...analyses].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      const detailResponse = await api.get(`/api/analyses/${latestAnalysis.analysisId}`);
      
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