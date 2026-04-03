import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aiConsultantIcon from '../images/consultant_icons.png'; 

function FloatingChatbot() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>
        {`
          @keyframes pulse-ring {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6); }
            /* 🚨 팩트 체크: 커진 본체에 맞춰 파동의 퍼짐 범위를 16px에서 22px로 확장 */
            70% { transform: scale(1); box-shadow: 0 0 0 22px rgba(37, 99, 235, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
          @keyframes float-up {
            0% { transform: translateY(0px); }
            /* 무거워진 본체 느낌을 살리기 위해 부유하는 폭을 8px에서 10px로 약간 증가 */
            50% { transform: translateY(-10px); } 
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {/* 플로팅 버튼 본체 */}
      <div
        onClick={() => navigate('/ai-consultant')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '40px',  
          zIndex: 9999,   
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: hovered ? 'none' : 'float-up 3s ease-in-out infinite',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* 마우스 호버 시 나타나는 말풍선 (글씨 크기 및 여백 미세 조정) */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#f7f8ff',
          padding: '10px 20px',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: '800',
          marginBottom: '16px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          border: '1px solid #1e293b',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease',
        }}>
          ✨ AI 커리어 어드바이저
        </div>

        {/* 🚨 핵심 1: 프로필 본체 크기 120% 확대 (80px -> 96px) */}
        <div style={{
          position: 'relative',
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          animation: 'pulse-ring 2.5s infinite',
          boxShadow: '0 8px 24px rgba(37,99,235,0.4)'
        }}>
          <img
            src={aiConsultantIcon}
            alt="AI 컨설턴트"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              /* 커진 덩치에 밀리지 않도록 파란 테두리도 3px -> 4px로 확대 */
              border: '4px solid #38bdf8', 
              objectFit: 'cover',
              backgroundColor: '#1e293b'
            }}
          />
          {/* 🚨 핵심 2: 온라인 상태 초록색 닷 크기도 비율에 맞게 확대 (18px -> 22px) */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '22px',
            height: '22px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            border: '3px solid #ffffff'
          }}></div>
        </div>
      </div>
    </>
  );
}

export default FloatingChatbot;