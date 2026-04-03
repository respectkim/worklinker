import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MiniCalendar from './MiniCalendar'; // 🚨 우리가 만든 '진짜' 달력을 불러옵니다!
import './LeftSidebar.css';

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="left-sidebar-content">
      <h1 className="logo">
        {/* <span>WorkLinker</span>  */}
      </h1>
      
      {/* 네비게이션 버튼 영역 (필요시 주석 해제) */}
      {/* <div className="nav-btns">
        <button 
          className={`nav-btn ${location.pathname === '/home' ? 'active' : ''}`}
          onClick={() => navigate('/home')}
        >
          🏠 추천교육
        </button>
        <button 
          className={`nav-btn ${location.pathname === '/program' ? 'active' : ''}`}
          onClick={() => navigate('/program')}
        >
          📋 교육/채용 탐색
        </button>
      </div> */}

      <div className="mini-calendar-area">
        <h3 className="menu-title">나의 일정</h3>
        
        {/* 🚨 기존의 하드코딩된 가짜 달력을 지우고, 진짜 달력 컴포넌트를 배치합니다. */}
        <MiniCalendar />
        
      </div>
    </div>
  );
}

export default LeftSidebar;