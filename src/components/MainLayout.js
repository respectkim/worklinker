// // src/components/MainLayout.js
// import { Outlet, Navigate } from "react-router-dom";
// import UserProfile from "./UserProfile";
// import "./MainLayout.css";

// export default function MainLayout() {
//   // 🔐 로그인 정보 (기존 방식 존중)
//   const user = JSON.parse(localStorage.getItem("user"));

//   // 로그인 안 됐으면 차단
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="main-layout">
//       {/* 좌측 프로필 영역 */}
//       <aside className="sidebar">
//         <UserProfile user={user} />
//       </aside>

//       {/* 우측 콘텐츠 영역 (기존 페이지 그대로) */}
//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }


// import UserProfile from './UserProfile';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// export default function MainLayout() {
//   const navigate = useNavigate();

//   // 🔧 개발용 강제 로그인 처리
//   const isLoggedIn =
//     process.env.NODE_ENV === 'development'
//       ? true
//       : localStorage.getItem('token'); // 실제 로직

//   useEffect(() => {
//     console.log('📦 MainLayout 렌더링됨');
//     console.log('🔐 isLoggedIn:', isLoggedIn);

//     if (!isLoggedIn) {
//       navigate('/login');
//     }
//   }, [isLoggedIn, navigate]);

//   if (!isLoggedIn) return null;

//   return (
//     <div className="layout">
//       <UserProfile />
//       <main className="content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import UserProfile from './UserProfile';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './MainLayout.css';

export default function MainLayout() {
  const navigate = useNavigate();

  // 🔧 개발용 강제 로그인 처리
  const isLoggedIn =
    process.env.NODE_ENV === 'development'
      ? true
      : localStorage.getItem('token');

  useEffect(() => {
    console.log('📦 MainLayout 렌더링됨');
    console.log('🔐 isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="layout">
      {/* 좌측 명함형 프로필 */}
      <aside className="sidebar">
        <UserProfile />
      </aside>

      {/* 우측 실제 페이지 */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}