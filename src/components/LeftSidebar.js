import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MiniCalendar from './MiniCalendar'; // 🚨 우리가 만든 '진짜' 달력을 불러옵니다!
import './LeftSidebar.css';

// 챗본 아이콘 이미지 불러오기
import aiConsultantIcon from '../images/consultant_icons.png';

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();


  // AI상담소 이동 함수 추가
  const handleStartConsulting = () => {
    navigate('/ai-Consultant');
  };

  return (
    // 사이드바 전체를 감싸는 영역을 flex로 만들어 하단 고정을 준비합니다.
    <div className="left-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* --- 위쪽 기존 코드들 (로고, 네비게이션, 미니캘린더) 그대로 유지 --- */}
      <div style={{ flex: 1 }}>
        <h1 className="logo"></h1>
        <div className="mini-calendar-area">
          <h3 className="menu-title">나의 일정</h3>
          <MiniCalendar />
        </div>
      </div>

      {/* 🚨 3. 팀원이 만든 좌측 하단 AI 퀵 메뉴 UI를 그대로 복사해서 맨 아래에 붙여넣기
      <div className="sidebar-footer" style={{
        padding: '20px', 
        borderTop: '1px solid #e2e8f0', 
        backgroundColor: '#ffffff',
        marginTop: 'auto' // 부모가 flex일 때 맨 아래로 밀어냄
      }}>
        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', letterSpacing: '0.5px', fontWeight: 'bold' }}>MY AI ADVISOR</p>
        
        <div 
          onClick={handleStartConsulting}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            padding: '12px', borderRadius: '12px', background: '#f8fafc',
            border: '1px solid #cbd5e1', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        >
         <img 
          src={aiConsultantIcon} 
          alt="AI 컨설턴트" 
          style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #2563eb', objectFit: 'cover' }} 
          />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>강중구 컨설턴트</p>
            <p style={{ fontSize: '11px', color: '#2563eb', margin: '2px 0 0 0', fontWeight: 'bold' }}>상담 시작하기</p>
          </div>
        </div>
      </div> */}

    </div>
  );
}

export default LeftSidebar;