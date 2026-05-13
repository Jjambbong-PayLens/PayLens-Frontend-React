import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';

function MainPage() {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    const token = getAccessToken();

    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Main Content */}
      <main className="main">
        <div className="main-content">
          <h3 className="subtitle">외국인 임금</h3>
          <h2 className="title">Abnormal Processing</h2>
          <p className="description">thanks for visiting our website</p>
          <button className="btn-primary" onClick={handleDashboardClick}>
            지금 탐지하기
          </button>
        </div>

        <div className="main-gallery">
          <div className="gallery-col col-1">
            <img 
              src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=500" 
              style={{ aspectRatio: '16/9' }} 
              alt="그래피티 1" 
            />
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500" 
              style={{ aspectRatio: '1/1' }} 
              alt="달러 기호 1" 
            />
          </div>
          
          <div className="gallery-col col-2">
            <img 
              src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500" 
              style={{ aspectRatio: '3/4' }} 
              alt="몬스터 아트" 
            />
          </div>
          
          <div className="gallery-col col-3">
            <img 
              src="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=800" 
              style={{ aspectRatio: '4/5' }} 
              alt="모노폴리 캐릭터" 
            />
          </div>
          
          <div className="gallery-col col-4">
            <img 
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500" 
              style={{ aspectRatio: '16/9' }} 
              alt="그래피티 2" 
            />
            <img 
              src="https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=500" 
              style={{ aspectRatio: '1/1' }} 
              alt="달러 기호 2" 
            />
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="feature-section" id="features">
        <h2 className="feature-title">강력한 이상 탐지 서비스</h2>
        <p className="feature-desc">
          전문가들도 사용하는 강력한 외국인 임금<br />
          이상 탐지 기능
        </p>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 payLens. All rights reserved.</p>
      </footer>
    </>
  );
}

export default MainPage;
