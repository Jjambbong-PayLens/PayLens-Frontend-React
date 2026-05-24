import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function MyPage() {
  const { t, i18n } = useTranslation();
  const user = getUser();

  const [userInfo, setUserInfo] = useState({
    username: user?.username || '사용자',
    language: i18n.language
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/api/user/info');
        setUserInfo({
          username: response.data.username,
          language: response.data.language
        });
        if (i18n.language !== response.data.language) {
          i18n.changeLanguage(response.data.language);
        }
      } catch (error) {
        console.error("유저 정보를 불러오는 데 실패했습니다.", error);
      }
    };
    fetchUserInfo();
  }, [i18n]);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    
    // 1. 사용자에게 즉시 언어 변경 적용 (기다릴 필요 없이 바로 반영)
    i18n.changeLanguage(newLang);
    setUserInfo(prev => ({ ...prev, language: newLang }));

    // 2. 서버 저장은 백그라운드에서 조용히 수행 (실패해도 사용자에게 알림 띄우지 않음)
    try {
      await api.post('/api/language', { language: newLang });
      console.log("언어 설정이 서버에 저장되었습니다.");
    } catch (error) {
      console.error("서버 저장 실패 (화면은 변경되었으니 안심하세요):", error);
      // alert는 제거하여 사용자 경험을 부드럽게 유지합니다.
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
            <p>{userInfo.username}</p>
          </div>
          
          <div className="info-group">
            <label>{t('MyPage_label_language')}</label>
            <p>{i18n.language === 'ko' ? '한국어 (Korean)' : i18n.language === 'en' ? 'English (United States)' : 'Tiếng Việt (Vietnam)'}</p>
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
          <tbody></tbody>
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
          <tbody></tbody>
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