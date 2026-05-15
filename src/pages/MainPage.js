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

      {/* Footer */}
      <footer>
        <p>&copy; 2026 payLens. All rights reserved.</p>
      </footer>
    </>
  );
}

export default MainPage;
