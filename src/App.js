import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import Contents from './components/Contents/Contents';
import ProgramExplorePage from './components/Program/ProgramExplorePage';
import Schedule from './pages/Schedule';
// ⭐ 1. AiConsultant 컴포넌트를 임포트하세요 (경로 확인 필수!)
import AiConsultant from './pages/AiConsultant'; 
import './App.css';

function App() {
  const user = { id: "Jong-kyung", address: "서울시 강남구"};

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout user={user} />}>
            <Route index element={<Contents />} />
            <Route path="program" element={<ProgramExplorePage user={user} />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="schedule/:date" element={<Schedule />} />
            
            {/* ⭐ 2. 챗봇 페이지 경로를 추가해야 버튼 클릭 시 화면이 바뀝니다! */}
            <Route path="ai-consultant" element={<AiConsultant />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;