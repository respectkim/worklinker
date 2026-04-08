import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
import "./MainLayout.css"; // 혹시 기존 CSS가 충돌하면 아래 인라인 스타일을 참고하세요.
import CommonHeader from "../CommonHeader";


import FloatingChatbot from '../FloatingChatbot'

export default function MainLayout({ user }) {
  return (
    <div className="layout-page">
      <CommonHeader />
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
      {/* 페이지 하단에 챗봇 버튼 추가 */}
      <div style={{position:'fixed', bottom:'30px', right: '30px', zIndex:9999}}>
        <FloatingChatbot />
      </div>
    </div>
  );
}