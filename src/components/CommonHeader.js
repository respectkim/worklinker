import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';

export default function CommonHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('worklinker_user');
  
  if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
    setUser(null);
    return;
  }

  try {
    setUser(JSON.parse(savedUser));
  } catch (error) {
    console.error('worklinker_user 파싱 실패:', error);
    localStorage.removeItem('worklinker_user');
    setUser(null);
  }
}, [location.pathname]);
  const moveToSection = (sectionId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('worklinker_user');
    setUser(null);
    alert('로그아웃되었습니다.');
    navigate('/home');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">
          <img src="/logo2.png" alt="logo" />
          <button
            type="button"
            onClick={() => moveToSection('home')}
            className="header-name"
          >
            WorkLinker
          </button>
        </h1>

        <nav className="main-nav">
          <button
            type="button"
            onClick={() => moveToSection('trend')}
            className="main-nav-link nav-button"
          >
            취업동향
          </button>

          <button
            type="button"
            onClick={() => moveToSection('jobs')}
            className="main-nav-link nav-button"
          >
            추천직무
          </button>

          <Link to="/success" className="main-nav-link">
            성공사례
          </Link>

          <Link to="/program" className="main-nav-link">
            추천교육
          </Link>

          <Link to="/contents" className="main-nav-link">
            유튭영상
          </Link>
        </nav>
      </div>

      <nav className="nav">
        {user ? (
          <>
            <span className="nav-user">{user.username}님</span>
            <span className="nav-divider" />
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link nav-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <span className="nav-divider" />
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}