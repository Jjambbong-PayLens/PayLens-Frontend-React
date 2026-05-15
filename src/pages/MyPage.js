import React, { useState } from 'react';
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';

function MyPage() {
  const { t } = useTranslation();
  const user = getUser();

  const [userInfo] = useState({
    username: '홍길동',
    email: 'gildong@example.com',
    phone: '010-1234-5678',
    language: '한국어 (Korean)'
  });
  
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
            <p>{userInfo.language}</p>
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
            <button className="outline-btn">{t('MyPage_btn_withdraw')}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyPage;