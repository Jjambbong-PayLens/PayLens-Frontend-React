import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation} from 'react-router-dom';
import { getAccessToken, logout } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import LanguageModal from './LanguageModal';

function MainLayout() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('Abnormal Processing');

  const location = useLocation();
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
    window.location.reload();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="main-page">
      <header className="header-wrapper">
        <div className="gnb-top">
          <div className="gnb-logo">
            <NavLink 
              to="/"
              style={{
                borderRight: ['/', '/pricing', '/explain'].includes(location.pathname) ? '' : 'none',
                paddingRight: ['/', '/pricing', '/explain'].includes(location.pathname) ? '' : '0px'
              }}
            >
              <img
                src="https://i.postimg.cc/htrdm6VM/Pay-Lens-logo.png"
                style={{ height: '32px', width: 'auto' }}
                alt="payLens 로고"
              />
            </NavLink>
          </div>

          <div className="gnb-active-menu">
            <nav className="sub-nav">
              <button
                type="button"
                className={`nav-button ${activeButton === 'Abnormal Processing' ? 'active' : ''}`}
                onClick={() => {
                  setActiveButton('Abnormal Processing');
                  navigate('/');
                }}
              >
                Abnormal Processing
              </button>
              <button
                type="button"
                className={`nav-button ${activeButton === '플랜 비교' ? 'active' : ''}`}
                onClick={() => {
                  setActiveButton('플랜 비교');
                  navigate('/pricing');
                }}
              >
                {t('nav1')}
              </button>
              <button
                type="button"
                className={`nav-button ${activeButton === '기능 설명' ? 'active' : ''}`}
                onClick={() => {
                  setActiveButton('기능 설명');
                  navigate('/explain');
                }}
              >
                기능 설명
              </button>
            </nav>
          </div>

          <div className="gnb-other">
            <div className="user-actions">
              <div 
                className="lang-selector" 
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <svg viewBox="0 0 24 24" fill="black" width="24" height="24" aria-label="언어 변경">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              {getAccessToken() ? (
                <>
                  <svg
                    className="icon-user"
                    viewBox="0 0 24 24"
                    fill="black"
                    width="24"
                    height="24"
                    role="button"
                    tabIndex={0}
                    aria-label="마이페이지로 이동"
                    onClick={() => navigate('/mypage')}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate('/mypage'); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <button className="btn-login" onClick={handleLogoutClick}>
                    로그아웃
                  </button>
                </>
              ) : (
                <button className="btn-login" onClick={handleLoginClick}>
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="gnb-bottom">
          <span className="breadcrumb">
            홈 &nbsp;/&nbsp; Abnormal Processing
          </span>
        </div>
      </header>
      <LanguageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Outlet />
    </div>
  );
}

export default MainLayout;