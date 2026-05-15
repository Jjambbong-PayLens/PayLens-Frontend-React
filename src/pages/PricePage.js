import React from 'react';
import { useTranslation } from 'react-i18next';

function PricePage() {
  const { t } = useTranslation();

  const priceCards = [
    {
      id: 1,
      discount: "40%",
      icon: '🏅',
      name: t('PricePage_name'),
      originalPrice: "₩7,000",
      price: '₩5,000',
      period: t('PricePage_period'),
      description: t('PricePage_description'),
    }
  ];

  return (
    <>
      <main className="price-main">
        <div className="price-header">
          <h1 className="price-title">{t('PricePage_title')}</h1>
          <p className="price-subtitle">{t('PricePage_subtitle')}</p>
        </div>

        <div className="price-cards-grid">
          {priceCards.map((card) => (
            <div key={card.id} className="price-card">
              {card.discount && (
                <div className="discount-badge">{card.discount} {t('PricePage_discount')}</div>
              )}
              
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-name">{card.name}</h3>
              
              <div className="card-price">
                {card.originalPrice && (
                  <span className="original-price">{card.originalPrice}</span>
                )}
                <span className="price">{card.price}</span>
                <span className="period">{card.period}</span>
              </div>
              
              <p className="card-description">{card.description}</p>
              
              <div className="card-features">
                {t('PricePage_feature').split('\n').map((featureLine, idx) => (
                  <div key={idx} className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="#1e40af" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{featureLine}</span>
                  </div>
                ))}
              </div>
              
              <div className="card-footer">
                <span className="security-badge">🔒 Secure transaction</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="security-info">
        <div className="security-info-content">
          <svg className="security-shield" viewBox="0 0 24 24" width="32" height="32">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#1e40af"/>
          </svg>
          <p className="security-text">{t('PricePage_security-text')}</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 payLens. All rights reserved.</p>
      </footer>
    </>
  );
}

export default PricePage;
