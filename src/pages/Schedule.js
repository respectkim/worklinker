import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Schedule.css';

function Schedule() {
  const { date } = useParams();
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = date || today;

  const [todoList, setTodoList] = useState(() => {
    const saved = localStorage.getItem('worklinker_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '2026-03-13', content: '팀 프로젝트 중간 보고' },
      { id: 2, date: '2026-03-13', content: '자격증 시험' }
    ];
  });

  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('worklinker_todos', JSON.stringify(todoList));
  }, [todoList]);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const nextTodo = {
      id: Date.now(),
      date: selectedDate,
      content: newTodo
    };
    setTodoList([...todoList, nextTodo]);
    setNewTodo('');
  };

  const handleDelete = (id) => {
    if(window.confirm("이 일정을 삭제할까요?")) {
      setTodoList(todoList.filter(todo => todo.id !== id));
    }
  };

  const filteredList = todoList.filter(t => t.date === selectedDate);

  return (
    <div className="schedule-container">
      {/* 제목 영역 */}
      <div className="schedule-header">
        <h2 className="title">📅 {selectedDate} 일정 상세</h2>
        <p className="sub-desc">오늘의 계획을 기록하고 관리하세요.</p>
      </div>

      {/* 입력 영역 */}
      <div className="schedule-input-group">
        <input 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="새로운 일정을 입력하세요..." 
        />
        <button className="save-btn" onClick={handleAddTodo}>
          일정 저장
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="todo-list-area">
        <h4 className="list-count">등록된 할 일 <span>{filteredList.length}건</span></h4>
        {filteredList.length > 0 ? (
          <ul className="todo-list">
            {filteredList.map(todo => (
              <li key={todo.id} className="todo-item">
                <span className="todo-text">📌 {todo.content}</span>
                <button className="del-btn" onClick={() => handleDelete(todo.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            해당 날짜에 등록된 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;