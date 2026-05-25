import React from 'react';

function ExplainPage() {
  const features = [
    {
      id: 1,
      icon: '📊',
      title: '정확한 임금 분석',
      description: 'AI 기반 알고리즘으로 급여명세서를 자동으로 분석하여 임금 체불 여부를 정확하게 판단합니다.',
    },
    {
      id: 2,
      icon: '⚖️',
      title: '법률 상담',
      description: '노무 전문가들이 제공하는 상세한 법률 리포트로 근로자의 권리를 보호합니다.',
    },
    {
      id: 3,
      icon: '📱',
      title: '간편한 사용',
      description: '복잡한 절차 없이 몇 클릭만으로 임금 분석을 시작할 수 있습니다.',
    },
    {
      id: 4,
      icon: '🔒',
      title: '데이터 보안',
      description: '사용자의 개인정보는 최고 수준의 보안 기술로 안전하게 보호됩니다.',
    },
    {
      id: 5,
      icon: '💾',
      title: '리포트 저장',
      description: 'PDF 형식으로 분석 결과를 저장하고 언제든 확인할 수 있습니다.',
    },
    {
      id: 6,
      icon: '📈',
      title: '월별 비교',
      description: '여러 달의 급여를 비교하여 패턴을 분석하고 문제를 조기에 발견합니다.',
    },
  ];

  const steps = [
    { step: 1, title: '회원가입', description: 'PayLens에 가입하세요' },
    { step: 2, title: '급여명세서 업로드', description: '급여명세서를 업로드합니다' },
    { step: 3, title: 'AI 분석', description: 'AI가 즉시 분석합니다' },
    { step: 4, title: '결과 확인', description: '상세한 리포트를 받습니다' },
  ];

  return (
    <>
      <main className="explain-main">
        {/* 서비스 소개 */}
        <section className="explain-intro">
          <div className="intro-content">
            <h1 className="intro-title">PayLens 서비스 소개</h1>
            <p className="intro-subtitle">외국인 근로자를 위한 AI 임금 분석 서비스</p>
            <p className="intro-description">
              PayLens는 인공지능 기술을 활용하여 급여명세서를 분석하고, 
              임금 체불 가능성을 조기에 발견하는 서비스입니다. 
              근로자의 정당한 권리를 보호하고 안심할 수 있는 근무 환경을 만들어갑니다.
            </p>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="explain-features">
          <div className="features-header">
            <h2 className="features-title">주요 기능</h2>
            <p className="features-subtitle">PayLens의 강력한 기능들을 소개합니다</p>
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
            <h2 className="steps-title">사용 방법</h2>
            <p className="steps-subtitle">4가지 간단한 단계로 시작하세요</p>
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
          <h2 className="trust-title">신뢰할 수 있는 서비스</h2>
          <div className="trust-items">
            <div className="trust-item">
              <div className="trust-icon">✅</div>
              <h3>정확성</h3>
              <p>최첨단 AI 기술으로 정확한 분석</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🛡️</div>
              <h3>보안</h3>
              <p>최고 수준의 데이터 보안 시스템</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">👨‍⚖️</div>
              <h3>전문성</h3>
              <p>노무 전문가의 맞춤형 상담</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">⏰</div>
              <h3>24/7 지원</h3>
              <p>언제든 도움을 받을 수 있습니다</p>
            </div>
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
