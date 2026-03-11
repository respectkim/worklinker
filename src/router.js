

import { Routes, Route } from 'react-router-dom';

import Main from './Main';              // ⭐ 추가
import Home from './pages/Home';
import Program from './pages/Program';  // 기존 Home 역할
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Recommend from './pages/Recommend';
import Contents from './pages/Contents';
import Postboard from './pages/Postboard'; // ⭐ 신규 추가
import MileageTree from './pages/Mileagetree'; // ⭐ 신규 추가
import Bookshelf from './pages/Bookshelf'; // ⭐ 신규 추가
import Schedule from './pages/Schedule'; // ⭐ 신규 추가

function Router() {
  return (
    <Routes>
      {/* 랜딩 & 인증 */}
      <Route path="/" element={<Main />} />        {/* 첫 진입 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 로그인 후 공통 레이아웃 */}
      <Route element={<MainLayout />}>
      <Route path="/home" element={<Home />} />    {/* 로그인 후 */}    
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/contents" element={<Contents />} />
      <Route path="/program" element={<Program />} />
      <Route path="/postboard" element={<Postboard />} />   {/* ⭐ 신규 추가 */}
      <Route path="/mileagetree" element={<MileageTree />} />  {/* ⭐ 신규 추가 */}
      <Route path="/bookshelf" element={<Bookshelf />} />  {/* ⭐ 신규 추가 */}
      <Route path="/schedule" element={<Schedule />} />  {/* ⭐ 신규 추가 */}
    </Route>
    </Routes>
  );
}

export default Router;