// Home.js
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="page">
      <div className="home-container">
        <h2 className="member">AI 학습 & 성장 플랫폼</h2>

        <p className="home-intro">
          나에게 맞는 콘텐츠를 추천받고,<br />
          학습 기록을 쌓아 성장 나무를 키워보세요.
        </p>

        <div className="home-grid">
          <Link to="/program" className="home-card">
            <h3>🤖 추천 콘텐츠</h3>
            <p>AI 기반으로 선별된 교육과 영상 콘텐츠</p>
          </Link>

          <Link to="/contents" className="home-card">
            <h3>🔍 콘텐츠 탐색</h3>
            <p>카테고리별 학습 자료 탐색</p>
          </Link>

          <Link to="/postboard" className="home-card">
            <h3>💬 커뮤니티</h3>
            <p>게시글과 댓글로 경험 공유</p>
          </Link>

          <Link to="/mileagetree" className="home-card">
            <h3>🌱 성장 나무</h3>
            <p>활동으로 마일리지를 쌓고 성장 확인</p>
          </Link>

          <Link to="/bookshelf" className="home-card">
            <h3>📚 나의 책꽃이</h3>
            <p>꾸준히 읽고 보기 위한 콘텐츠 보관</p>
          </Link>

          <Link to="/schedule" className="home-card">
            <h3>📅 일정 관리 </h3>
            <p>목표한 일정을 수립하고 목표 달성</p>
          </Link>


        </div>
      </div>
    </div>
  );
}

export default Home;