import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 프로젝트 루트의 .env 파일에 아래처럼 저장하세요:
//   REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
// .env 파일은 반드시 .gitignore에 추가하세요.
const API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = '당신은 중장년(40~60대) 재취업 및 교육 전문 컨설턴트입니다. ' +
  '따뜻하고 공손한 말투로, 상담자의 상황에 공감하며 실질적인 조언을 드리세요. ' +
  '재취업 전략, 이력서·자기소개서 작성, 직업훈련 및 국비교육 안내, 자격증 취득, ' +
  '워크넷·고용센터 활용법, 중장년 일자리 지원 정책 등에 특화된 전문가입니다. ' +
  '막막함을 느끼는 분들에게 용기와 방향을 드리는 것이 최우선입니다.';

const QUICK_QUESTIONS = [
  '50대 재취업 어떻게 시작하나요?',
  '국비 무료교육 신청 방법',
  '이력서 잘 쓰는 방법 알려줘',
  '중장년 일자리 지원 정책은?',
];

async function fetchClaude(messages) {
  var response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages,
    }),
  });

  if (!response.ok) {
    var err = await response.json();
    throw new Error(err.error ? err.error.message : 'API 오류');
  }

  var data = await response.json();
  return data.content[0].text;
}

// ── 말풍선 컴포넌트 ──────────────────────────────────
function Bubble(props) {
  var isUser = props.role === 'user';
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }
  },
    !isUser && React.createElement('div', {
      style: {
        width: 32, height: 32, borderRadius: '50%',
        background: '#f0f0f0', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 16, marginRight: 8, flexShrink: 0,
      }
    }, '🤖'),
    React.createElement('div', {
      style: {
        maxWidth: '72%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#1a73e8' : '#f1f3f4',
        color: isUser ? '#fff' : '#202124',
        fontSize: 14, lineHeight: 1.6,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }
    }, props.text)
  );
}

// ── 로딩 애니메이션 ──────────────────────────────────
function TypingDots() {
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px' }
  },
    React.createElement('style', null,
      '@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }'
    ),
    [0, 1, 2].map(function(i) {
      return React.createElement('span', {
        key: i,
        style: {
          width: 8, height: 8, borderRadius: '50%',
          background: '#aaa', display: 'inline-block',
          animation: 'bounce 1.2s ' + (i * 0.2) + 's infinite',
        }
      });
    })
  );
}

// ── 메인 챗봇 컴포넌트 ──────────────────────────────
function ClaudeChatbot() {
  var navigate = useNavigate();
  var bottomRef = useRef(null);

  var initialMessages = [{
    role: 'assistant',
    content: '안녕하세요! 중장년 재취업·교육 전문 AI 컨설턴트입니다.\n재취업 전략, 직업훈련, 자격증, 지원 정책 등 무엇이든 편하게 물어보세요. 😊',
  }];

  var stateResult = useState(initialMessages);
  var messages = stateResult[0];
  var setMessages = stateResult[1];

  var inputResult = useState('');
  var input = inputResult[0];
  var setInput = inputResult[1];

  var loadingResult = useState(false);
  var loading = loadingResult[0];
  var setLoading = loadingResult[1];

  useEffect(function() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  function send() {
    var text = input.trim();
    if (!text || loading) return;

    var userMsg = { role: 'user', content: text };
    var nextMessages = messages.concat([userMsg]);
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    fetchClaude(nextMessages)
      .then(function(reply) {
        setMessages(function(prev) {
          return prev.concat([{ role: 'assistant', content: reply }]);
        });
      })
      .catch(function(e) {
        setMessages(function(prev) {
          return prev.concat([{ role: 'assistant', content: '오류가 발생했습니다: ' + e.message }]);
        });
      })
      .finally(function() {
        setLoading(false);
      });
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column',
      height: '100vh', maxWidth: 640,
      margin: '0 auto', fontFamily: 'sans-serif',
    }
  },

    // 헤더
    React.createElement('div', {
      style: {
        padding: '16px 20px', borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
      }
    },
      React.createElement('span', { style: { fontSize: 24 } }, '🤖'),
      React.createElement('div', null,
        React.createElement('div', { style: { fontWeight: 600, fontSize: 15 } }, '중장년 재취업·교육 AI 컨설턴트'),
        React.createElement('div', { style: { fontSize: 12, color: '#888' } }, 'Claude Haiku 4.5 기반')
      ),
      React.createElement('button', {
        onClick: function() { navigate(-1); },
        style: {
          marginLeft: 'auto', background: 'none', border: 'none',
          fontSize: 20, cursor: 'pointer', color: '#888',
        }
      }, '✕')
    ),

    // 메시지 영역
    React.createElement('div', {
      style: { flex: 1, overflowY: 'auto', padding: '16px 20px', background: '#fff' }
    },
      messages.map(function(m, i) {
        return React.createElement(Bubble, { key: i, role: m.role, text: m.content });
      }),
      loading && React.createElement('div', {
        style: { display: 'flex', justifyContent: 'flex-start' }
      },
        React.createElement('div', {
          style: { background: '#f1f3f4', borderRadius: '18px 18px 18px 4px', marginBottom: 12 }
        },
          React.createElement(TypingDots, null)
        )
      ),
      React.createElement('div', { ref: bottomRef })
    ),

    // 추천 질문 (첫 메시지만)
    messages.length === 1 && React.createElement('div', {
      style: {
        padding: '0 20px 12px', display: 'flex',
        flexWrap: 'wrap', gap: 8, background: '#fff',
      }
    },
      QUICK_QUESTIONS.map(function(q) {
        return React.createElement('button', {
          key: q,
          onClick: function() { setInput(q); },
          style: {
            padding: '6px 12px', borderRadius: 20,
            border: '1px solid #1a73e8', background: '#fff',
            color: '#1a73e8', fontSize: 13, cursor: 'pointer',
          }
        }, q);
      })
    ),

    // 입력창
    React.createElement('div', {
      style: {
        padding: '12px 16px', borderTop: '1px solid #e0e0e0',
        display: 'flex', gap: 10, background: '#fff', alignItems: 'flex-end',
      }
    },
      React.createElement('textarea', {
        value: input,
        onChange: function(e) { setInput(e.target.value); },
        onKeyDown: handleKey,
        placeholder: '질문을 입력하세요… (Enter: 전송, Shift+Enter: 줄바꿈)',
        rows: 1,
        style: {
          flex: 1, padding: '10px 14px', borderRadius: 20,
          border: '1px solid #ddd', fontSize: 14,
          resize: 'none', outline: 'none', lineHeight: 1.5,
          maxHeight: 120, overflowY: 'auto',
        }
      }),
      React.createElement('button', {
        onClick: send,
        disabled: loading || !input.trim(),
        style: {
          width: 40, height: 40, borderRadius: '50%',
          border: 'none',
          background: (loading || !input.trim()) ? '#ccc' : '#1a73e8',
          color: '#fff', fontSize: 18,
          cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
          flexShrink: 0,
        }
      }, '↑')
    )
  );
}

export default ClaudeChatbot;
