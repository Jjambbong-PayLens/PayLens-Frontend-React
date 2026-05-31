import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getUploadedDocuments, deleteDocuments } from '../utils/documentApi';
import PaymentModal from './PaymentModal';
import DocumentListModal from './DocumentListModal'; // 🌟 1. 전체 문서 모달 불러오기

function MyPage() {
  const { t, i18n } = useTranslation();
  const user = getUser();

  const [userInfo, setUserInfo] = useState({
    username: user?.username || t('MyPage_default_username'),
    language: i18n.language,
    isSubscribed: false 
  });

  const [documents, setDocuments] = useState([]);
  const [isDocsLoading, setIsDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState(null);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false); // 🌟 2. 더보기 모달 열림 상태 State 추가

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/api/user/info');
      setUserInfo({
        username: response.data.username,
        language: response.data.language,
        isSubscribed: response.data.subscribed || false 
      });
      if (i18n.language !== response.data.language) {
        i18n.changeLanguage(response.data.language);
      }
    } catch (error) {
      console.error("유저 정보를 불러오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [i18n]);

  const fetchDocuments = async () => {
    try {
      setIsDocsLoading(true);
      setDocsError(null);
      const data = await getUploadedDocuments();
      let safeDocs = [];
      if (Array.isArray(data)) {
        safeDocs = data;
      } else if (data && Array.isArray(data.documents)) {
        safeDocs = data.documents;
      }
      setDocuments(safeDocs);
    } catch (error) {
      console.error("문서 목록 조회 실패:", error);
      setDocsError(t('MyPage_error_load_docs'));
      setDocuments([]);
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [t]);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    setUserInfo(prev => ({ ...prev, language: newLang }));
    try {
      await api.post('/api/language', { language: newLang });
    } catch (error) {
      console.error("서버 저장 실패:", error);
    }
  };
  
  const handleDeleteDocument = async (documentId) => {
    const isConfirm = window.confirm(t('MyPage_confirm_delete_doc'));
    if (!isConfirm) return;

    try {
      await deleteDocuments([documentId]);
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.documentId !== documentId));
      alert(t('MyPage_alert_delete_success'));
    } catch (error) {
      console.error("문서 삭제 실패:", error);
      alert(error.message || t('MyPage_alert_delete_fail'));
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
    fetchUserInfo();
  };

  return (
    <main className="page mypage-container">
      <header className="mypage-header">
        <h1>{t('MyPage_title')}</h1>
        <p>{t('MyPage_description')}</p>
      </header>

      <section className="card profile-section">
        <div className="section-header">
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

      {/* 문서 목록 섹션 */}
      <section className="card table-section" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h3>{t('MyPage_doc_title')}</h3>
          {/* 🌟 3. 더보기 버튼에 onClick 이벤트 바인딩하여 모달 열기 */}
          <button className="more-btn" onClick={() => setIsDocModalOpen(true)}>
            {t('MyPage_btn_more')}
          </button>
        </div>
        <table className="mypage-table">
          <thead>
            <tr>
              <th>{t('MyPage_th_filename')}</th>
              <th>{t('MyPage_th_analysis_date')}</th>
              <th>{t('MyPage_th_file_type')}</th>
              <th>{t('MyPage_th_status')}</th>
              <th>{t('MyPage_th_manage')}</th> 
            </tr>
          </thead>
          <tbody>
            {isDocsLoading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>{t('MyPage_msg_loading')}</td></tr>
            ) : docsError ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'red', padding: '20px' }}>{docsError}</td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>{t('MyPage_msg_no_docs')}</td></tr>
            ) : (
              // 메인 화면 테이블에서는 기존대로 최대 5개까지만 축약 노출
              documents.slice(0, 5).map(doc => (
                <tr key={doc.documentId}>
                  <td>{doc.fileName}</td>
                  <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td>
                    {doc.contentType && doc.contentType.includes('pdf') ? t('MyPage_type_pdf') : doc.contentType && doc.contentType.includes('image') ? t('MyPage_type_image') : t('MyPage_type_other')}
                  </td>
                  <td>
                    <span className={`status-badge ${doc.status === 'UPLOADED' ? 'completed' : 'analyzing'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold', backgroundColor: doc.status === 'UPLOADED' ? '#e6f4ea' : '#fff3e0', color: doc.status === 'UPLOADED' ? '#1e8e3e' : '#f29900' }}>
                      {doc.status === 'UPLOADED' ? t('MyPage_status_completed') : t('MyPage_status_analyzing')}
                    </span>
                  </td>
                  <td>
                    <button className="danger-btn" style={{ padding: '4px 12px', fontSize: '12px', color: '#dc3545', border: '1px solid #dc3545', background: 'white', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDeleteDocument(doc.documentId)}>
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

      {/* 결제 모달 */}
      <PaymentModal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} onPaymentSuccess={handlePaymentSuccess} />

      {/* 🌟 4. 전체 문서 목록 조회 모달 장착! */}
      <DocumentListModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        documents={documents} // 축약 없이 전체 리스트 전달
        onDeleteDoc={handleDeleteDocument} // 모달 안에서도 똑같이 삭제 가능하도록 전송
      />
    </main>
  );
}

export default MyPage;