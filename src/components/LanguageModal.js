import React from 'react';
import { useTranslation } from 'react-i18next';
import { updateUserLanguageAPI } from '../utils/documentApi';

function LanguageModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();

  if (!isOpen) return null;

  const languages = [
    { name: '한국어', region: 'South Korea', code: 'ko' },
    { name: 'English', region: 'United States', code: 'en' },
    { name: 'Tiếng Việt', region: 'Vietnam', code: 'vi' }
  ];

  const handleLanguageChange = async (langCode) => {
    try {
      i18n.changeLanguage(langCode);

      await updateUserLanguageAPI(langCode);
      
      console.log('서버에 언어 설정이 저장되었습니다.');
    } catch (error) {
      console.error('서버에 언어 설정을 저장하는데 실패했습니다:', error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <button className="close-btn" onClick={onClose}>&times;</button>
          <div className="modal-tabs">
            <button className="tab active">언어 및 지역</button>
          </div>
        </header>

        <div className="modal-body">
          <section className="lang-section">
            <h3>언어와 지역을 선택하세요</h3>
            <div className="lang-grid">
              {languages.map((lang) => (
                <div 
                  key={lang.code} 
                  className={`lang-item ${i18n.language === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <strong>{lang.name}</strong>
                  <span>{lang.region}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LanguageModal;