import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const SYSTEM_PROMPT = '당신은 중장년(40~60대) 재취업 및 교육 전문 컨설턴트입니다. ' +
  '매우 공손하고 전문적인 존댓말을 사용하되, 불필요한 인사말, 무의미한 공감 표현, 장황한 서론이나 결론 등의 사족은 철저히 배제하십시오. ' +
  '사용자의 질문을 받으면 곧바로 핵심으로 진입하여, 팩트 기반의 실질적인 해결책(재취업 전략, 직업훈련, 지원 정책 등)만을 구조화하여 간결하고 명확하게 답변하십시오.';

const QUICK_QUESTIONS = [
  '50대 재취업 어떻게 시작하나요?',
  '국비 무료교육 신청 방법',
  '이력서 잘 쓰는 방법 알려줘',
  '중장년 일자리 지원 정책은?',
];

async function fetchClaude(messages) {
  const response = await fetch('http://13.124.46.84:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096, // 넉넉한 토큰 확보
      system: SYSTEM_PROMPT,
      messages: messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error ? err.error.message : 'API 오류');
  }
  const data = await response.json();
  return data.content[0].text;
}

// ── 말풍선 컴포넌트 ──────────────────────────────────
function Bubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
      {!isUser && (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 10, flexShrink: 0 }}>🤖</div>
      )}
      <div style={{
        maxWidth: '75%', padding: '14px 18px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#2563eb' : '#ffffff',
        color: isUser ? '#ffffff' : '#0f172a',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: isUser ? 'none' : '1px solid #e2e8f0',
        fontSize: 15, lineHeight: 1.6, wordBreak: 'break-word',
      }}>
        {isUser ? <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span> : <ReactMarkdown>{text}</ReactMarkdown>}
      </div>
    </div>
  );
}

// ── 메인 챗봇 컴포넌트 ──────────────────────────────
function ClaudeChatbot() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '안녕하세요. 중장년 재취업 전문 컨설턴트입니다.\n어떤 부분에 대한 도움이 필요하신지 말씀해 주십시오.',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    fetchClaude(nextMessages)
      .then(reply => setMessages(prev => [...prev, { role: 'assistant', content: reply }]))
      .catch(e => setMessages(prev => [...prev, { role: 'assistant', content: `오류가 발생했습니다: ${e.message}` }]))
      .finally(() => setLoading(false));
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    // 🚨 핵심: height를 100vh가 아닌 부모 공간(헤더 제외)에 맞추고, 최대 너비를 설정해 화면 중앙에 정렬
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 81px)', width: '100%', maxWidth: '850px', margin: '0 auto', background: '#f8fafc' }}>
      
      {/* 헤더 영역 */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', borderRadius: '0 0 16px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <span style={{ fontSize: 26 }}>🤖</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>AI 커리어 어드바이저</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>실시간 맞춤형 컨설팅 진행 중</div>
        </div>
      </div>

      {/* 대화 내역 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        {messages.map((m, i) => <Bubble key={i} role={m.role} text={m.content} />)}
        {loading && <div style={{ color: '#64748b', fontSize: 14, marginLeft: 48 }}>답변을 분석하고 있습니다...</div>}
        <div ref={bottomRef} />
      </div>

      {/* 추천 질문 (처음에만 노출) */}
      {messages.length === 1 && (
        <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {QUICK_QUESTIONS.map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 입력창 영역 */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <textarea
          value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder="여기에 질문을 입력하세요... (Enter로 전송)"
          rows={1}
          style={{ flex: 1, padding: '14px 18px', borderRadius: 24, border: '1px solid #cbd5e1', fontSize: 15, resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto', background: '#f1f5f9' }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ width: 50, height: 50, borderRadius: '50%', border: 'none', background: (loading || !input.trim()) ? '#cbd5e1' : '#2563eb', color: '#fff', fontSize: 20, cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
          ↑
        </button>
      </div>
    </div>
  );
}

export default ClaudeChatbot;