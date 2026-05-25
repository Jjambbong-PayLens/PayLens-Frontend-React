import React from 'react';
import { useTranslation } from 'react-i18next';

function ExplainPage() {
  const { t } = useTranslation();
  const features = [
    {
      id: 1,
      icon: '📊',
      title: t('ExplainPage_features-title1'),
      description: t('ExplainPage_features-desc1'),
    },
    {
      id: 2,
      icon: '⚖️',
      title: t('ExplainPage_features-title2'),
      description: t('ExplainPage_features-desc2'),
    },
    {
      id: 3,
      icon: '📱',
      title: t('ExplainPage_features-title3'),
      description: t('ExplainPage_features-desc3'),
    },
    {
      id: 4,
      icon: '🔒',
      title: t('ExplainPage_features-title4'),
      description: t('ExplainPage_features-desc4'),
    },
    {
      id: 5,
      icon: '💾',
      title: t('ExplainPage_features-title5'),
      description: t('ExplainPage_features-desc5'),
    },
    {
      id: 6,
      icon: '📈',
      title: t('ExplainPage_features-title6'),
      description: t('ExplainPage_features-desc6'),
    },
  ];

  const steps = [
    { step: 1, title: t('ExplainPage_steps-title1'), description: t('ExplainPage_steps-desc1') },
    { step: 2, title: t('ExplainPage_steps-title2'), description: t('ExplainPage_steps-desc2') },
    { step: 3, title: t('ExplainPage_steps-title3'), description: t('ExplainPage_steps-desc3') },
    { step: 4, title: t('ExplainPage_steps-title4'), description: t('ExplainPage_steps-desc4') },
  ];

  const trustItems = [
    {
      id: 1,
      icon: '✅',
      title: t('ExplainPage_trust-title1'),
      description: t('ExplainPage_trust-desc1'),
    },
    {
      id: 2,
      icon: '🛡️',
      title: t('ExplainPage_trust-title2'),
      description: t('ExplainPage_trust-desc2'),
    },
    {
      id: 3,
      icon: '👨‍⚖️',
      title: t('ExplainPage_trust-title3'),
      description: t('ExplainPage_trust-desc3'),
    },
    {
      id: 4,
      icon: '⏰',
      title: t('ExplainPage_trust-title4'),
      description: t('ExplainPage_trust-desc4'),
    },
  ];

  return (
    <>
      <main className="explain-main">
        {/* 서비스 소개 */}
        <section className="explain-intro">
          <div className="intro-content">
            <h1 className="intro-title">{t('ExplainPage_intro-title')}</h1>
            <p className="intro-subtitle">{t('ExplainPage_intro-subtitle')}</p>
            <p className="intro-description">{t('ExplainPage_intro-description')}</p>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="explain-features">
          <div className="features-header">
            <h2 className="features-title">{t('ExplainPage_features-title')}</h2>
            <p className="features-subtitle">{t('ExplainPage_features-subtitle')}</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 사용 방법 */}
        <section className="explain-steps">
          <div className="steps-header">
            <h2 className="steps-title">{t('ExplainPage_steps-title')}</h2>
            <p className="steps-subtitle">{t('ExplainPage_steps-subtitle')}</p>
          </div>
          
          <div className="steps-container">
            {steps.map((item, idx) => (
              <div key={item.step} className="step-item">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
                {idx < steps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* 신뢰할 수 있는 서비스 */}
        <section className="explain-trust">
          <h2 className="trust-title">{t('ExplainPage_trust-title')}</h2>
          <div className="trust-items">
            {trustItems.map((item) => (
              <div key={item.id} className="trust-item">
                <div className="trust-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 payLens. All rights reserved.</p>
      </footer>
    </>
  );
}

export default ExplainPage;
