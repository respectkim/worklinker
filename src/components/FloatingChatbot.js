import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aiConsultantIcon from '../image/consultant_icons.png';

function FloatingChatbot() {
  var navigate = useNavigate();
  var hoverState = useState(false);
  var hovered = hoverState[0];
  var setHovered = hoverState[1];

  return React.createElement(
    React.Fragment,
    null,

    // 애니메이션 스타일
    React.createElement('style', null,
      '@keyframes pulse {' +
      '  0%,100% { box-shadow: 0 0 0 0 rgba(253,224,71,0.5); }' +
      '  50%      { box-shadow: 0 0 0 10px rgba(253,224,71,0); }' +
      '}' +
      '@keyframes bounce-in {' +
      '  0%  { transform: scale(1); }' +
      '  40% { transform: scale(1.12); }' +
      '  100%{ transform: scale(1); }' +
      '}'
    ),

    // 플로팅 버튼 본체
    React.createElement('div', {
        onClick: function() { navigate('/ai-consultant'); },
        onMouseEnter: function() { setHovered(true); },
        onMouseLeave: function() { setHovered(false); },
        style: {
          position: 'fixed',
          bottom: '30px',
          left: '320px',          // 사이드바(300px) + 여백 20px → 겹침 방지
          zIndex: 9999,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.2s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }
      },

      // AI 상담 뱃지
      React.createElement('div', {
        style: {
          backgroundColor: '#1e293b',
          color: '#fde047',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          border: '1px solid #334155',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0.85,
          transition: 'opacity 0.2s ease',
        }
      }, 'AI 상담'),

      // 아이콘 이미지
      React.createElement('img', {
        src: aiConsultantIcon,
        alt: 'AI 컨설턴트',
        style: {
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: '3px solid #fde047',
          objectFit: 'cover',
          imageRendering: 'auto',
          animation: hovered
            ? 'bounce-in 0.3s ease'
            : 'pulse 2.4s ease-in-out infinite',
        }
      })
    )
  );
}

export default FloatingChatbot;
