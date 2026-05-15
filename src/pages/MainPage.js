import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';
import { useTranslation } from 'react-i18next';

function MainPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDashboardClick = () => {
    const token = getAccessToken();

    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
const newsArticles = [
  {
    id: 1,
    tag: "정책",
    title: "공공부문 기간제 노동자 공정수당 지급... 기간 따라 최대 10%(종합)",
    date: "2026.04.28",
    image: "https://imgnews.pstatic.net/image/001/2026/04/28/PYH2026042804600001300_P4_20260428160133928.jpg?type=w860", // 실제 기사 썸네일 주소로 변경
  },
  {
    id: 2,
    tag: "법률",
    title: "외국인 노동자 인권개선 회의…\"근로조건 위반 뿌리 뽑자\"",
    date: "2026.04.23",
    image: "https://img5.yna.co.kr/photo/yna/YH/2026/04/09/PYH2026040905300001300_P4.jpg",
  },
  {
    id: 3,
    tag: "뉴스",
    title: "\"월급 못받았는데 어떡해?\"…정부 'AI 노동법 상담' 전면 개편",
    date: "2026.04.15",
    image: "https://img4.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202604/15/sbscnbc/20260415181801896ujzu.png",
  }
];
  return (
    <>
      {/* Main Content */}
      <main className="main">
        <div className="main-content">
          <h3 className="subtitle">{t('MainPage_subtitle')}</h3>
          <h2 className="title">Abnormal Processing</h2>
          <p className="description">{t('MainPage_description')}</p>
          <button className="btn-primary" onClick={handleDashboardClick}>
            {t('MainPage_button')}
          </button>
        </div>

        <div className="main-gallery">
          <div className="gallery-col col-1">
            <img 
              src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=500" 
              style={{ aspectRatio: '16/9' }} 
              alt="image 1" 
            />
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500" 
              style={{ aspectRatio: '1/1' }} 
              alt="image 2" 
            />
          </div>
          
          <div className="gallery-col col-2">
            <img 
              src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500" 
              style={{ aspectRatio: '3/4' }} 
              alt="image 3" 
            />
          </div>
          
          <div className="gallery-col col-3">
            <img 
              src="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=800" 
              style={{ aspectRatio: '4/5' }} 
              alt="image 4" 
            />
          </div>
          
          <div className="gallery-col col-4">
            <img 
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500" 
              style={{ aspectRatio: '16/9' }} 
              alt="image 5" 
            />
            <img 
              src="https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=500" 
              style={{ aspectRatio: '1/1' }} 
              alt="image 6" 
            />
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="feature-section" id="features">
        <h2 className="feature-title">{t('MainPage_feature-title')}</h2>
        <p className="feature-desc">
          {t('MainPage_feature-desc')}<br />
        </p>
      </section>
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>최신 노동 정책 및 뉴스</h2>
            <p>근로자와 고용주 모두에게 꼭 필요한 최신 정보를 확인하세요.</p>
          </div>

          <div className="news-grid">
            {newsArticles.map((article) => (
              <div key={article.id} className="news-card">
                <div className="card-image">
                  {/* 🌟 2. image-placeholder 대신 실제 사진 주소를 넣습니다! */}
                  <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="card-content">
                  <span className="card-tag">{article.tag}</span>
                  <h3 className="card-title">{article.title}</h3>
                  <span className="card-date">{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 payLens. All rights reserved.</p>
      </footer>
    </>
  );
}

export default MainPage;
