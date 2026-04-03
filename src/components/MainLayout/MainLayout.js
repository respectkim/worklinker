import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
// ⭐ 플로팅 챗봇 컴포넌트 임포트 (경로를 본인의 구조에 맞게 확인하세요)
import FloatingChatbot from '../FloatingChatbot'; 

export default function MainLayout({ user }) {
  return (
    <div className="main-layout" style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100vh', 
      position: 'relative', // 기준점 설정
      backgroundColor: '#f8fafc' 
    }}>
      
      {/* 1. 좌측 사이드바 (여기가 비어있다면 임포트 확인!) */}
      <aside style={{ width: '300px', backgroundColor: '#161b2a' }}>
        <LeftSidebar />
      </aside>

      {/* 2. 중앙 메인 영역 */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet context={{ user }} /> 
      </main>

      {/* 3. 우측 사이드바 */}
      <aside style={{ width: '300px' }}>
        <RightSidebar user={user} />
      </aside>

      {/* 4. ⭐ 챗봇 버튼 (위치를 절대값으로 강제 고정) */}
      <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 9999 }}>
        <FloatingChatbot />
      </div>
    </div>
  );
}