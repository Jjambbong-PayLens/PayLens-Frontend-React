import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import LanguageModal from './LanguageModal';

function Layout() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="gnb-logo">
          <NavLink to="/">
            <img
              src="https://i.postimg.cc/htrdm6VM/Pay-Lens-logo.png"
              style={{ height: '32px', width: 'auto' }}
              alt="payLens 로고"
            />
          </NavLink>
        </div>
        <nav className="nav-list">
          <NavLink to="/dashboard">{t('layout_dashboard')}</NavLink>
          <NavLink to="/preanalysis">{t('layout_preanalysis')}</NavLink>
          <NavLink to="/analysis">{t('layout_analysis')}</NavLink>
          <NavLink to="/mypage">{t('layout_mypage')}</NavLink>
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI Wage Analysis</p>
            <h1>{t('layout_title')}</h1>
          </div>
          <div className="user-box">
            {location.pathname !== '/result' && (
              <button
                type="button"
                className="lang-selector"
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, transform: 'translateX(-15px)' }}
                aria-label={t('LanguageModal_title')}
              >
                <svg viewBox="0 0 24 24" fill="black" width="24" height="24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </button>
            )}
            <button type="button" className="ghost-button" onClick={handleLogout}>{t('MainLayout_logout')}</button>
          </div>
        </header>

        <Outlet />
        <LanguageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
}

export default Layout;
