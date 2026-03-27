import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Schedule.css';

function Schedule() {
  const { date } = useParams();
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = date || today;

  // localStorage에서 데이터를 가져오거나 기본값 사용
  const [todoList, setTodoList] = useState(() => {
    const saved = localStorage.getItem('worklinker_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '2026-03-13', content: '팀 프로젝트 중간 보고' },
      { id: 2, date: '2026-03-13', content: '사각증 시험' }
    ];
  });

  const [newTodo, setNewTodo] = useState('');

  // todoList 변경 시 자동으로 localStorage에 저장
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
    // ⭐ 부모 영역을 가득 채우도록 width: 100%, max-width: 100% 설정
    <div className="schedule-card-fixed" style={{ width: '100%', maxWidth: '100%', margin: '0 auto', background: 'none', padding: 0 }}>
      
      {/* 제목 영역 */}
      <div className="schedule-header-box" style={{ marginBottom: '30px' }}>
        <h2 className="title" style={{ color: '#fde047', fontSize: '28px', textAlign: 'center' }}>📅 {selectedDate} 일정 상세</h2>
        <p className="sub-desc" style={{ color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>오늘의 계획을 기록하고 관리하세요.</p>
      </div>

      {/* 입력 영역 */}
      <div className="input-group" style={{ display: 'flex', gap: '15px', marginBottom: '40px', background: '#0f172a', padding: '15px', borderRadius: '12px' }}>
        <input 
          style={{ flex: 1, background: 'transparent', border: '1px solid #475569', borderRadius: '10px', color: 'white', padding: '12px', fontSize: '16px' }}
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="오늘의 일정을 입력하세요..." 
        />
        <button 
          className="save-btn" 
          onClick={handleAddTodo}
          style={{ padding: '12px 25px', background: '#fde047', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          일정 저장
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="todo-list-area">
        <h4 className="list-count" style={{ color: 'white', marginBottom: '20px' }}>등록된 할 일 ({filteredList.length}건)</h4>
        {filteredList.length > 0 ? (
          <ul className="todo-list" style={{ listStyle: 'none', padding: 0 }}>
            {filteredList.map(todo => (
              <li key={todo.id} className="todo-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
                <span className="todo-text" style={{ color: 'white', fontSize: '17px' }}>📌 {todo.content}</span>
                <button 
                  className="del-btn" 
                  onClick={() => handleDelete(todo.id)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-msg" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            해당 날짜에 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;