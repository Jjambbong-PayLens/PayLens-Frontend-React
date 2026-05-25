import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { logout } from '../utils/auth';
import { deleteDocuments, getDocuments } from '../utils/documentApi';
import { withdrawUser } from '../utils/authApi';
import { useTranslation } from 'react-i18next';

function MyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getUser();

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDocuments = async () => {
    setLoadingDocuments(true);

    try {
      const response = await getDocuments();
      setDocuments(response?.result?.documents || response?.documents || []);
    } catch (error) {
      console.error('문서 목록 조회 실패:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDeleteDocument = async (documentId) => {
    try {
      setActionLoading(true);
      await deleteDocuments([documentId]);
      await loadDocuments();
    } catch (error) {
      console.error('문서 삭제 실패:', error);
      alert(error.message || '문서 삭제에 실패했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('정말 회원탈퇴 하시겠습니까?')) {
      return;
    }

    try {
      setActionLoading(true);
      await withdrawUser();
      logout();
      alert('회원탈퇴가 완료되었습니다.');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      alert(error.message || '회원탈퇴에 실패했습니다.');
    } finally {
      setActionLoading(false);
    }
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
            <p>{user?.username || t('MyPage_user_fallback')}</p>
          </div>
          <div className="info-group">
            <label>{t('MyPage_label_language')}</label>
            <p>{user?.language || 'KO'}</p>
          </div>
        </div>
      </section>

      <section className="card table-section">
        <div className="section-header">
          <h3>{t('MyPage_payment_title')}</h3>
          <button className="more-btn">{t('MyPage_btn_more')}</button>
        </div>
        <table className="mypage-table">
          <thead>
            <tr>
              <th>{t('MyPage_th_date')}</th>
              <th>{t('MyPage_th_details')}</th>
              <th>{t('MyPage_th_amount')}</th>
              <th>{t('MyPage_th_status')}</th>
              <th>{t('MyPage_th_item')}</th>
            </tr>
          </thead>
          <tbody>
            {loadingDocuments ? (
              <tr>
                <td colSpan="5">문서 목록을 불러오는 중입니다.</td>
              </tr>
            ) : documents.length > 0 ? (
              documents.map((document) => (
                <tr key={document.documentId}>
                  <td>{document.fileName}</td>
                  <td>{document.createdAt ? new Date(document.createdAt).toLocaleDateString() : '-'}</td>
                  <td>{document.documentType}</td>
                  <td>{document.status}</td>
                  <td>
                    <button type="button" className="outline-btn" onClick={() => handleDeleteDocument(document.documentId)} disabled={actionLoading}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">업로드된 문서가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="card table-section">
        <div className="section-header">
          <h3>{t('MyPage_doc_title')}</h3>
          <button className="more-btn">{t('MyPage_btn_more')}</button>
        </div>
        <table className="mypage-table">
          <thead>
            <tr>
              <th>{t('MyPage_th_filename')}</th>
              <th>{t('MyPage_th_analysis_date')}</th>
              <th>{t('MyPage_th_type')}</th>
              <th>{t('MyPage_th_result')}</th>
              <th>{t('MyPage_th_manage')}</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </section>


      <section className="card security-section">
        <div className="section-header">
          <h3>{t('MyPage_security_title')}</h3>
        </div>
        <div className="security-list">
          <div className="security-item danger">
            <div>
              <strong>{t('MyPage_withdraw')}</strong>
              <p>{t('MyPage_withdraw_desc')}</p>
            </div>
            <button className="outline-btn" onClick={handleWithdraw} disabled={actionLoading}>{t('MyPage_btn_withdraw')}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyPage;