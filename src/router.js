import { Routes, Route } from 'react-router-dom';

import Main from './Main'; 
import Home from './pages/Home';
import ProgramExplorePage from './components/Program/ProgramExplorePage';
import MainLayout from './components/MainLayout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Contents from './components/Contents/Contents';
import Schedule from './pages/Schedule'; 
import Success from './pages/Success';
import SuccessDetail from './pages/SuccessDetail';
import SuccessWrite from './pages/SuccessWrite';

function Router() {
  return (
    <Routes>
      {/* 랜딩 & 인증 */}
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 로그인 후 공통 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />   
        <Route path="/contents" element={<Contents />} />
        <Route path="/program" element={<ProgramExplorePage />} />
       

        {/* ⭐ 일정 관리: 기본 접속과 날짜 클릭 접속을 모두 허용하도록 수정 */}
        <Route path="/schedule" element={<Schedule />} /> 
        <Route path="/schedule/:date" element={<Schedule />} /> 
      </Route>

      <Route path='/success' element={<Success/>}/>
      <Route path='/success/:id' element={<SuccessDetail/>}/> 
      <Route path='/success/write' element={<SuccessWrite/>}/> 
    </Routes>
  );
}

export default Router;