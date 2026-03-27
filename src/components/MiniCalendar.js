import React, { useState } from 'react';
import './MiniCalendar.css'; // CSS 연결

const MiniCalendar = () => {
  const [currentDate] = useState(new Date());
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
      </div>
      
      <div className="calendar-grid">
        {/* 요일 표시 */}
        {daysOfWeek.map(day => (
          <div key={day} className="day-of-week">{day}</div>
        ))}
        
        {/* 날짜 표시 (임시 31일 예시) */}
        {[...Array(31)].map((_, i) => (
          <div key={i} className="calendar-day">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="calendar-status">
        ● 일정 관리 활성화 중...
      </div>
    </div>
  );
};

export default MiniCalendar;