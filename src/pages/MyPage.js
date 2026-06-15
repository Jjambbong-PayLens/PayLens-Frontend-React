import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import PaymentModal from './PaymentModal';
import DocumentListModal from './DocumentListModal';

function MyPage() {
  const { t, i18n } = useTranslation();
  const user = getUser();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: user?.username || localStorage.getItem('nickname') || t('MyPage_default_username'),
    language: i18n.language,
    isSubscribed: false 
  });
 
  const [analyses, setAnalyses] = useState([]);
  const [isDocsLoading, setIsDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState(null);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false); 

  const totalCount = analyses.length;
  const currentMonth = new Date().getMonth();
  const newThisMonthCount = analyses.filter(a => new Date(a.createdAt).getMonth() === currentMonth).length;
  
  const fetchAnalyses = useCallback(async () => {
    try {
      setIsDocsLoading(true);
      setDocsError(null);
      
      const response = await api.get('/api/analyses');
      const data = response.data.result || [];
      
      setAnalyses(data);
    } catch (error) {
      console.error("분석 리포트 목록 조회 실패:", error);
      setDocsError(t('MyPage_error_load_docs', '분석 기록을 불러오지 못했습니다.'));
      setAnalyses([]);
    } finally {
      setIsDocsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  
  const handleDeleteAnalysis = async (analysisId) => {
    const isConfirm = window.confirm(t('MyPage_confirm_delete_doc', '정말 이 분석 기록을 삭제하시겠습니까?'));
    if (!isConfirm) return;

    try {
      await api.delete(`/api/analyses/${analysisId}`);
      setAnalyses((prev) => prev.filter((item) => item.analysisId !== analysisId));
      alert(t('MyPage_alert_delete_success', '삭제되었습니다.'));
    } catch (error) {
      console.error("분석 기록 삭제 실패:", error);
      alert(t('MyPage_alert_delete_fail', '삭제에 실패했습니다.'));
    }
  };

  const handleViewAnalysis = async (analysisId) => {
    try {
      const response = await api.get(`/api/analyses/${analysisId}`);
      navigate(`/result/${analysisId}`, { 
        state: { analysisResult: response.data.result } 
      });
    } catch (error) {
      console.error("상세 분석 결과를 불러오는데 실패했습니다.", error);
      alert(t('MyPage_alert_fetch_fail', '분석 결과를 불러오는 데 실패했습니다.'));
    }
  };

  const handleWithdraw = async () => {
    const isConfirm = window.confirm(t('MyPage_confirm_withdraw'));
    if (!isConfirm) return;

    try {
      await api.delete('/api/auth/withdraw');
      alert(t('MyPage_alert_withdraw_success'));
      localStorage.removeItem('accessToken');
      window.location.href = '/'; 
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert(t('MyPage_alert_withdraw_fail'));
    }
  };

  const handlePaymentSuccess = () => {
    setUserInfo(prev => ({ ...prev, isSubscribed: true }));
  };

  return (
    <main className="page mypage-container">
      <header className="mypage-header">
        <h1>{t('MyPage_title')}</h1>
        <p>{t('MyPage_description')}</p>
      </header>

      <section className="card profile-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{t('MyPage_profile_title')}</h3>
        </div>
        <div className="profile-grid">
          <div className="info-group">
            <label>{t('MyPage_label_name')}</label>
            <p>{userInfo.username}</p>
          </div>
          <div className="info-group">
            <label>{t('MyPage_label_language')}</label>
            <p>{i18n.language === 'ko' ? t('MyPage_lang_ko') : i18n.language === 'en' ? t('MyPage_lang_en') : t('MyPage_lang_vi')}</p>
          </div>
          <div className="info-group" style={{ gridColumn: '1 / -1', marginTop: '12px', display: 'flex', gap: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{t('MyPage_total_reports', '총 분석 리포트')}: </span>
              <strong style={{ color: '#1e1b4b' }}>{totalCount}개</strong>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{t('MyPage_month_reports', '이번 달 생성 리포트')}: </span>
              <strong style={{ color: '#4f46e5' }}>{newThisMonthCount}개</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="card membership-section" style={{
        marginTop: '24px', padding: '28px 24px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5', backgroundColor: '#eef2ff', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t('MyPage_membership_badge', 'Membership Plan')}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '8px 0 4px 0', color: '#0f172a' }}>
            {userInfo.isSubscribed ? t('MyPage_membership_title_active') : t('MyPage_membership_title_inactive')}
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            {userInfo.isSubscribed ? t('MyPage_membership_desc_active') : t('MyPage_membership_desc_inactive')}
          </p>
        </div>

        {!userInfo.isSubscribed ? (
          <button type="button" onClick={() => setIsPayModalOpen(true)} style={{
            padding: '12px 20px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(15, 23, 42, 0.08)'
          }}>
            {t('MyPage_btn_subscribe_start')}
          </button>
        ) : (
          <span style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
            {t('MyPage_membership_status_active')}
          </span>
        )}
      </section>

      <section className="card table-section" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h3>{t('MyPage_analysis_title', '내 분석 리포트')}</h3>
          <button className="more-btn" onClick={() => setIsDocModalOpen(true)}>
            {t('MyPage_btn_more')}
          </button>
        </div>
        <table className="mypage-table">
          <thead>
            <tr>
              <th>{t('MyPage_th_filename', '대표 문서명')}</th>
              <th>{t('MyPage_th_analysis_date', '분석 일시')}</th>
              <th>{t('MyPage_th_doc_count', '관련 문서 수')}</th>
              <th>{t('MyPage_th_result', '분석 결과')}</th>
              <th>{t('MyPage_th_manage', '관리')}</th> 
            </tr>
          </thead>
          <tbody>
            {isDocsLoading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>{t('MyPage_msg_loading')}</td></tr>
            ) : docsError ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'red', padding: '20px' }}>{docsError}</td></tr>
            ) : analyses.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>{t('MyPage_msg_no_analyses', '분석 기록이 없습니다.')}</td></tr>
            ) : (
              analyses.slice(0, 5).map(analysis => (
                <tr key={analysis.analysisId}>
                  <td>{analysis.representativeDocumentName}</td>
                  <td>{new Date(analysis.createdAt).toLocaleDateString()}</td>
                  <td>{analysis.documentCount}개</td>
                  <td>
                    <button 
                      style={{ padding: '6px 12px', fontSize: '12px', color: '#ffffff', backgroundColor: '#4f46e5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} 
                      onClick={() => handleViewAnalysis(analysis.analysisId)}
                    >
                      {t('MyPage_btn_view_result', '결과 보기')}
                    </button>
                  </td>
                  <td>
                    <button 
                      className="danger-btn" 
                      style={{ padding: '4px 12px', fontSize: '12px', color: '#dc3545', border: '1px solid #dc3545', background: 'white', borderRadius: '4px', cursor: 'pointer' }} 
                      onClick={() => handleDeleteAnalysis(analysis.analysisId)}
                    >
                      {t('MyPage_btn_delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="card security-section" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h3>{t('MyPage_security_title')}</h3>
        </div>
        <div className="security-list">
          <div className="security-item danger">
            <div>
              <strong>{t('MyPage_withdraw')}</strong>
              <p>{t('MyPage_withdraw_desc')}</p>
            </div>
            <button className="outline-btn" onClick={handleWithdraw}>{t('MyPage_btn_withdraw')}</button>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} onPaymentSuccess={handlePaymentSuccess} />

      <DocumentListModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        documents={analyses} 
        onDeleteDoc={handleDeleteAnalysis}
      />
    </main>
  );
}

export default MyPage;