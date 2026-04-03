import { Routes, Route } from 'react-router-dom';

import Main from './Main'; 
import Home from './pages/Home';
import ProgramExplorePage from './components/Program/ProgramExplorePage';
import MainLayout from './components/MainLayout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Contents from './components/Contents/Contents';
import Schedule from './pages/Schedule'; 
// ⭐ 1. AiConsultant 페이지 컴포넌트를 임포트합니다.
import AiConsultant from './pages/AiConsultant'; 

function Router() {
  return (
    <Routes>
      {/* 랜딩 & 인증: 사이드바가 없는 독립 페이지들 */}
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 로그인 후 공통 레이아웃: 사이드바가 포함된 MainLayout 적용 영역 */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />   
        <Route path="/contents" element={<Contents />} />
        <Route path="/program" element={<ProgramExplorePage />} />
        
        {/* 일정 관리 */}
        <Route path="/schedule" element={<Schedule />} /> 
        <Route path="/schedule/:date" element={<Schedule />} /> 

        {/* ⭐ 2. AI 컨설턴트 대화창 경로 추가 */}
        {/* FloatingChatbot에서 navigate('/ai-consultant')를 실행하면 이 경로를 찾아옵니다. */}
        <Route path="/ai-consultant" element={<AiConsultant />} /> 
      </Route>
    </Routes>
  );
}

export default Router;