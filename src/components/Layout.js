import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

function Layout() {
  const navigate = useNavigate();
  const user = getUser();

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
          <NavLink to="/dashboard">대시보드</NavLink>
          <NavLink to="/analysis">임금 분석</NavLink>
          <NavLink to="/result">분석 결과</NavLink>
          <NavLink to="/payment">결제</NavLink>
          <NavLink to="/mypage">마이페이지</NavLink>
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI Wage Analysis</p>
            <h1>PayLens</h1>
          </div>
          <div className="user-box">
            <span>{user?.username || '사용자'}님</span>
            <button type="button" className="ghost-button" onClick={handleLogout}>로그아웃</button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
