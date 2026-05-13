import React from 'react';

const priceCards = [
  {
    id: 1,
    discount: null,
    icon: '☁️',
    name: '일반 플랜',
    originalPrice: null,
    price: '₩2,900',
    period: '/월',
    description: '부가세 포함. 매월 청구',
    features: [
      '무제한 분석 결과 PDF 저장',
      '월별 리포트 비교',
    ],
  },
  {
    id: 2,
    discount: "20%",
    icon: '✨️',
    name: '특화 플랜',
    originalPrice: "₩5,880",
    price: '₩4,900',
    period: '/월',
    description: '부가세 포함. 매월 청구',
    features: [
      '무제한 분석 결과 PDF 저장',
      '월별 리포트 비교',
      '무제한 임금 분석 및 검증',
      '상세 법률 리포트 발급',
    ],
  },
  {
    id: 3,
    discount: "40%",
    icon: '🏅',
    name: '프리미엄 플랜',
    originalPrice: "₩7,000",
    price: '₩5,000',
    period: '/월',
    description: '부가세 포함. 매월 청구',
    features: [
      '무제한 분석 결과 PDF 저장',
      '월별 리포트 비교',
      '무제한 임금 분석 및 검증',
      '상세 법률 리포트 발급',
      '노무 전문가 다이렉트 매칭 지원',
      '24/7 최우선 고객 지원 서비스'
    ],
  }
];

function PricePage() {

  return (
    <>
      <main className="price-main">
        <div className="price-header">
          <h1 className="price-title">플랜 및 가격</h1>
          <p className="price-subtitle">다양한 Abnormal Processing 플랜 중에서 선택하세요</p>
        </div>

        <div className="price-cards-grid">
          {priceCards.map((card) => (
            <div key={card.id} className="price-card">
              {card.discount && (
                <div className="discount-badge">{card.discount} 할인</div>
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
                {card.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="#1e40af" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="card-footer">
                <span className="security-badge">🔒 Secure transaction</span>
              </div>
              
              <button className="btn-purchase">
                {card.buttonText || '구매하기'}
              </button>
            </div>
          ))}
        </div>
      </main>

      <section className="security-info">
        <div className="security-info-content">
          <svg className="security-shield" viewBox="0 0 24 24" width="32" height="32">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#1e40af"/>
          </svg>
          <p className="security-text">PayLens는 사용자의 모든 데이터를 안전하게 보호합니다.</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 payLens. All rights reserved.</p>
      </footer>
    </>
  );
}

export default PricePage;
