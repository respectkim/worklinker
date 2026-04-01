import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
// import "./MainLayout.css"; // 혹시 기존 CSS가 충돌하면 아래 인라인 스타일을 참고하세요.

export default function MainLayout({ user }) {
  return (
    // 전체 대시보드: 화면에 꽉 차고 스크롤 없음
    <div className="main-layout" style={{ display: 'flex', width: '100%', height: '100vh', backgroundColor: '#c1cbe6', overflow: 'hidden' }}>
      {/* 1. 좌측 사이드바: 너비 고정 */}
      <div className="left-sidebar" style={{ width: '300px', height: '100%', overflowY: 'auto', flexShrink:0 }}>
        <LeftSidebar />
      </div>

      {/* 2. 중앙 영역: 여기가 핵심! 남은 공간 다 차지 */}
      <main className="content-area" style={{ flex: 1, height: '100%', padding: '0px', overflowY: 'auto' }}>
        {/* ⭐ Outlet Context를 통해 자식에게 데이터 전달 */}
        <Outlet context={{ user }} /> 
      </main>

      {/* 3. 우측 사이드바: 너비 고정 */}
      <div className="right-sidebar" >
        <RightSidebar user={user} />
      </div>
    </div>
  );
}