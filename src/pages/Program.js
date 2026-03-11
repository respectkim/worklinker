import { useEffect, useState } from 'react';
import api from '../api/api';
import './Program.css';

function Program() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get('/recommend')
      .then(res => setList(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page">
      <div className="program-container">
        <h2 className="member">🤖 추천 콘텐츠</h2>

        {list.length === 0 && (
          <p className="loading">추천 정보를 불러오는 중...</p>
        )}

        <div className="content-list">
          {list.map((item, index) => (
            <div className="content-card" key={index}>
              <strong className="content-title">{item.title}</strong>
              {item.provider && <div className="content-provider">기관: {item.provider}</div>}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="content-link"
                >
                  영상 보러가기
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Program;
