import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🚨 useLocation 추가
import './MiniCalendar.css';

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation(); // 🚨 현재 브라우저의 URL 정보를 가져옵니다.

  // 🚨 URL에서 선택된 날짜 추출 (예: /schedule/2026-04-10 이면 '2026-04-10'만 뽑아냄)
  const pathParts = location.pathname.split('/');
  const selectedDateFromUrl = pathParts[1] === 'schedule' ? pathParts[2] : null;

  useEffect(() => {
    const saved = localStorage.getItem('worklinker_todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, [location]); // 일정이 추가/삭제되어 URL이 바뀔 때마다 동기화

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayDate = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatDate = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const hasEvent = (day) => {
    const targetDate = formatDate(day);
    return todos.some(todo => todo.date === targetDate);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="mini-calendar-container">
      <div className="calendar-header-wrapper">
        <button className="month-nav-btn" onClick={prevMonth}>&lt;</button>
        <div className="calendar-header">
          {year}년 {month + 1}월
        </div>
        <button className="month-nav-btn" onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className={`day-of-week ${day === '일' ? 'sunday' : day === '토' ? 'saturday' : ''}`}>{day}</div>
        ))}
        
        {emptyDays.map(empty => (
          <div key={`empty-${empty}`} className="calendar-day empty"></div>
        ))}

        {monthDays.map(day => {
          const isToday = day === todayDate && month === todayMonth && year === todayYear;
          const eventExists = hasEvent(day);
          
          // 🚨 핵심: 이 칸의 날짜가 현재 URL의 날짜와 똑같은지 검사
          const isSelected = formatDate(day) === selectedDateFromUrl; 
          
          return (
            <div 
              key={day} 
              // 🚨 URL과 일치하면 'selected' 클래스를 추가로 부여함
              className={`calendar-day ${isToday ? 'today' : ''} ${eventExists ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => navigate(`/schedule/${formatDate(day)}`)}
            >
              <span className="day-number">{day}</span>
              {eventExists && <span className="event-pin">📌</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;