import React from 'react';

function LanguageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const languages = [
    { name: '한국어', region: '대한민국' },
    { name: 'English', region: 'United States' },
    { name: 'Tiếng Việt', region: 'Việt Nam' },
    { name: 'Filipino', region: 'Pilipinas' },
  ];

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
              {languages.map((lang, idx) => (
                <div key={idx} className="lang-item" onClick={() => {
                  alert(`${lang.name}로 설정을 변경합니다.`);
                  onClose();
                }}>
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