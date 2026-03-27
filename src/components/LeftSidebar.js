import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import './LeftSidebar.css';

function LeftSidebar() {
  const { date } = useParams();
  const location = useLocation(); // URL 변화를 감지하기 위함
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = date || today;

  // 일정이 있는 날짜 목록을 저장할 상태
  const [eventDates, setEventDates] = useState([]);

  // 일정 데이터를 읽어오는 함수
  const updateEventMarkers = () => {
    const saved = localStorage.getItem('worklinker_todos');
    if (saved) {
      const todos = JSON.parse(saved);
      // 중복 제거된 날짜 목록 생성
      const dates = [...new Set(todos.map(todo => todo.date))];
      setEventDates(dates);
    }
  };

  // 1. 처음 로딩될 때 실행
  // 2. 일정을 새로 추가하거나 삭제해서 URL이 바뀔 때마다 다시 확인
  useEffect(() => {
    updateEventMarkers();
  }, [location]);

  return (
    <div className="left-sidebar-content">
      <h1 className="logo">
        <span>WorkLinker</span> 
      </h1>
      
      {/* 🚨 수정된 네비게이션 버튼 영역 */}
      <div className="nav-btns">
        <button 
          // 현재 URL이 /home 이면 'active' 클래스를 붙입니다.
          className={`nav-btn ${location.pathname === '/home' ? 'active' : ''}`}
          onClick={() => navigate('/home')}
        >
          🏠 간편보기 (홈)
        </button>
        <button 
          // 현재 URL이 /program 이면 'active' 클래스를 붙입니다.
          className={`nav-btn ${location.pathname === '/program' ? 'active' : ''}`}
          onClick={() => navigate('/program')}
        >
          📋 교육/채용 탐색
        </button>
      </div>

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
              // 해당 날짜에 일정이 있는지 확인
              const hasEvent = eventDates.includes(fullDate);

              return (
                <Link 
                  key={i} 
                  to={`/schedule/${fullDate}`} 
                  className={`cal-day-link ${isSelected ? 'active' : ''}`}
                  style={{ width: '100%', height: 'auto', aspectRatio: '1/1' }} // ⭐ 인라인 스타일 강제 부여
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
  );
}

export default LeftSidebar;