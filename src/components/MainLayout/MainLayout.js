import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
import "./MainLayout.css"; // 혹시 기존 CSS가 충돌하면 아래 인라인 스타일을 참고하세요.
import CommonHeader from "../CommonHeader";

export default function MainLayout({ user }) {
  return (
<<<<<<< HEAD
    <div className="layout-page">
      <CommonHeader />
=======
    // 전체 대시보드: 화면에 꽉 차고 스크롤 없음
    <div className="main-layout" style={{ display: 'flex', width: '100%', height: '100vh', backgroundColor: '#c1cbe6', overflow: 'hidden' }}>
      {/* 1. 좌측 사이드바: 너비 고정 */}
      <div className="left-sidebar" style={{ width: '300px', height: '100%', overflowY: 'auto', flexShrink:0 }}>
        <LeftSidebar />
      </div>
>>>>>>> main

      <div className="layout-body">
        <aside className="left-sidebar">
          <LeftSidebar />
        </aside>

        <main className="content-area">
          <Outlet context={{ user }} />
        </main>

        <aside className="right-sidebar">
          <RightSidebar user={user} />
        </aside>
      </div>
    </div>
  );
}