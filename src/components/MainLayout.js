import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../utils/auth';

function MainLayout() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('Abnormal Processing');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="main-page">
      <header className="header-wrapper">
        <div className="gnb-top">
          <div className="gnb-logo">
            <Link to="/">
              <img
                src="https://i.postimg.cc/htrdm6VM/Pay-Lens-logo.png"
                style={{ height: '32px', width: 'auto' }}
                alt="payLens 로고"
              />
            </Link>
          </div>

          <div className="gnb-active-menu">
            <nav className="sub-nav">
              <button
                type="button"
                className={`nav-button ${activeButton === 'Abnormal Processing' ? 'active' : ''}`}
                onClick={() => setActiveButton('Abnormal Processing')}
              >
                Abnormal Processing
              </button>
              <button
                type="button"
                className={`nav-button ${activeButton === '플랜 비교' ? 'active' : ''}`}
                onClick={() => setActiveButton('플랜 비교')}
              >
                플랜 비교
              </button>
              <button
                type="button"
                className={`nav-button ${activeButton === '기능 설명' ? 'active' : ''}`}
                onClick={() => setActiveButton('기능 설명')}
              >
                기능 설명
              </button>
            </nav>
          </div>

          <div className="gnb-other">
            <div className="user-actions">
              {getAccessToken() ? (
                <>
                  <svg className="icon-user" viewBox="0 0 24 24" fill="black" width="24" height="24">
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

      <Outlet />
    </div>
  );
}

export default MainLayout;