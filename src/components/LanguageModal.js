import React from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function LanguageModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();

  if (!isOpen) return null;

  const languages = [
    { name: '한국어', region: 'South Korea', code: 'ko' },
    { name: 'English', region: 'United States', code: 'en' }/*,
    { name: 'Tiếng Việt', region: 'Vietnam', code: 'vi' },
    { name: 'Filipino', region: 'Philippines', code: 'fil' },*/
  ];

  const handleLanguageChange = async (langCode) => {
    i18n.changeLanguage(langCode);

    try {
      const apiPath = process.env.REACT_APP_USER_LANGUAGE_API_PATH || '/api/users/language';
      await api.put(apiPath, { language: langCode.toUpperCase() });
    } catch (error) {
      console.error('선호 언어 저장 실패:', error);
    }

    onClose();
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
                  className={`lang-item ${i18n.language.startsWith(lang.code) ? 'selected' : ''}`}
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