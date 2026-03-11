// Schedule.js
import { useEffect, useState } from 'react';
import './Schedule.css';

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('schedules')) || [];
    setSchedules(saved);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSchedule = () => {
    if (!form.title || !form.date) return;

    const newItem = {
      id: Date.now(),
      ...form,
    };

    const updated = [newItem, ...schedules];
    setSchedules(updated);
    localStorage.setItem('schedules', JSON.stringify(updated));

    setForm({ title: '', date: '' });
  };

  const removeSchedule = (id) => {
    const updated = schedules.filter(item => item.id !== id);
    setSchedules(updated);
    localStorage.setItem('schedules', JSON.stringify(updated));
  };

  return (
    <div className="page">
      <div className="program-container">
        <h2 className="member">📅 일정 관리</h2>

        {/* 일정 추가 */}
        <div className="schedule-form">
          <input
            type="text"
            name="title"
            placeholder="일정 제목"
            value={form.title}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <button onClick={addSchedule}>추가</button>
        </div>

        {/* 일정 목록 */}
        {schedules.length === 0 && (
          <p className="loading">등록된 일정이 없습니다.</p>
        )}

        <div className="schedule-list">
          {schedules.map(item => (
            <div className="schedule-card" key={item.id}>
              <div>
                <strong className="schedule-title">{item.title}</strong>
                <div className="schedule-date">{item.date}</div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeSchedule(item.id)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
