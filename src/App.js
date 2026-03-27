import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout'; // 🚨 위치 확인 필수
import Contents from './components/Contents/Contents';       // 기존 홈 콘텐츠
import ProgramExplorePage from './components/Program/ProgramExplorePage';         // 🚨 새 교육 페이지
import Schedule from './pages/Schedule';
import './App.css';

function App() {
  // 임시 사용자 데이터 (나중에 실제 로그인 데이터와 연결)
  const user = { id: "Jong-kyung", address: "서울시 강남구"};

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 🚨 팩트 체크: MainLayout을 부모로 설정하여 
            모든 자식 페이지에서 사이드바가 유지되도록 합니다. 
          */}
          <Route path="/" element={<MainLayout user={user} />}>
            
            {/* 1. 홈 화면 (http://localhost:3000/) - 유튜브 콘텐츠 표시 */}
            <Route index element={<Contents />} />

            {/* 2. 교육 정보 페이지 (http://localhost:3000/program) */}
            <Route path="program" element={<ProgramExplorePage user={user} />} />

            {/* 3. 일정 관리 페이지 (http://localhost:3000/schedule) */}
            <Route path="schedule" element={<Schedule />} />
            <Route path="schedule/:date" element={<Schedule />} />
            
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;