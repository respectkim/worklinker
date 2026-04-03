import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniCalendar.css';

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  // 🚨 컴포넌트가 열릴 때마다 로컬 스토리지에서 일정을 가져옵니다.
  useEffect(() => {
    const saved = localStorage.getItem('worklinker_todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayDate = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 이번 달 1일의 요일과 이번 달 총 일수 계산
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 🚨 날짜 포맷 함수 (YYYY-MM-DD 형태로 변환)
  const formatDate = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // 🚨 해당 날짜에 일정이 존재하는지 검사하는 함수
  const hasEvent = (day) => {
    const targetDate = formatDate(day);
    return todos.some(todo => todo.date === targetDate);
  };

  // 달 이동 로직
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
          <div key={day} className="day-of-week">{day}</div>
        ))}
        
        {emptyDays.map(empty => (
          <div key={`empty-${empty}`} className="calendar-day empty"></div>
        ))}

        {monthDays.map(day => {
          const isToday = day === todayDate && month === todayMonth && year === todayYear;
          const eventExists = hasEvent(day);
          
          return (
            <div 
              key={day} 
              // 오늘 날짜이거나 일정이 있으면 별도의 클래스 부여
              className={`calendar-day ${isToday ? 'today' : ''} ${eventExists ? 'has-event' : ''}`}
              onClick={() => navigate(`/schedule/${formatDate(day)}`)} // 🚨 클릭 시 이동
            >
              <span className="day-number">{day}</span>
              {/* 일정이 있으면 압정 아이콘 표시 */}
              {eventExists && <span className="event-pin">📌</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;