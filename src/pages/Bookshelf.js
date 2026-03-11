// BookShelf.js
import { useEffect, useState } from 'react';
import './Bookshelf.css';

function BookShelf() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookshelf')) || [];
    setItems(saved);
  }, []);

  const removeItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('bookshelf', JSON.stringify(updated));
  };

  return (
    <div className="page">
      <div className="program-container">
        <h2 className="member">📚 내 책꽂이</h2>

        {items.length === 0 && (
          <p className="loading">아직 저장한 콘텐츠가 없습니다.</p>
        )}

        <div className="content-list">
          {items.map(item => (
            <div className="content-card" key={item.id}>
              <strong className="content-title">{item.title}</strong>

              {item.provider && (
                <div className="content-provider">
                  기관: {item.provider}
                </div>
              )}

              <div className="bookshelf-actions">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="content-link"
                  >
                    다시 보기
                  </a>
                )}

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  제거
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookShelf;