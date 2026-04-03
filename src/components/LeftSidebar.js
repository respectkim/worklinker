import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
// ⭐ 변경된 폴더명(image) 경로로 아이콘 임포트
import aiConsultantIcon from '../image/consultant_icons.png';
import './LeftSidebar.css';

function LeftSidebar() {
  const { date } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = date || today;

  // 일정이 있는 날짜 목록 상태
  const [eventDates, setEventDates] = useState([]);

  // 일정 데이터를 로컬스토리지에서 읽어오는 함수
  const updateEventMarkers = () => {
    const saved = localStorage.getItem('worklinker_todos');
    if (saved) {
      const todos = JSON.parse(saved);
      const dates = [...new Set(todos.map(todo => todo.date))];
      setEventDates(dates);
    }
  };

  useEffect(() => {
    updateEventMarkers();
  }, [location]);

  // AI 상담 페이지로 이동하는 함수
  const handleStartConsulting = () => {
    navigate('/ai-consultant');
  };

  return (
    <div className="left-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 1. 상단 로고 및 기본 메뉴 */}
      <div style={{ flex: 1 }}>
        <h1 className="logo">WORKLINK <span className="v-tag">v0.24</span></h1>
        
        <div className="nav-btns">
          <button className="nav-btn" onClick={() => navigate('/home')}>🏠 간편보기 (홈)</button>
          <button className="nav-btn" onClick={() => navigate('/program')}>📋 교육/채용 탐색</button>
        </div>

        {/* 2. 미니 캘린더 영역 */}
        <div className="mini-calendar-area">
          <h3 className="menu-title">나의 일정</h3>
          <div className="mini-calendar">
            <div className="cal-header">2026년 3월</div>
            <div className="cal-grid">
              {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                <div key={d} className="day-label">{d}</div>
              ))}
              {[...Array(31)].map((_, i) => {
                const dayNum = i + 1;
                const fullDate = `2026-03-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDate === fullDate;
                const hasEvent = eventDates.includes(fullDate);

                return (
                  <Link 
                    key={i} 
                    to={`/schedule/${fullDate}`} 
                    className={`cal-day-link ${isSelected ? 'active' : ''}`}
                    style={{ width: '100%', height: 'auto', aspectRatio: '1/1' }}
                  >
                    {dayNum}
                    {hasEvent && <span className="event-pin">📌</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ⭐ 좌측 하단 AI 컨설턴트 퀵 메뉴 (통합 추가) */}
      <div className="sidebar-footer" style={{
        padding: '20px', 
        borderTop: '1px solid #334155', 
        backgroundColor: '#1e293b',
        marginTop: 'auto' // 하단 고정
      }}>
        <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.5px' }}>MY AI ADVISOR</p>
        
        <div 
          onClick={handleStartConsulting}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            padding: '12px', borderRadius: '12px', background: '#0f172a',
            border: '1px solid #334155', transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#fde047'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
        >
         <img 
          src={aiConsultantIcon} 
          alt="AI 컨설턴트" 
          style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            border: '2px solid #fde047',
            objectFit: 'cover' 
          }} 
          />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: 0 }}>강중구 컨설턴트</p>
            <p style={{ fontSize: '11px', color: '#fde047', margin: '2px 0 0 0' }}>상담 시작하기</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;