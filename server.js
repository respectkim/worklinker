// server.js — 프록시 서버 (프로젝트 루트에 위치)
// 실행: node server.js
// API 키는 서버에서만 관리 (.env 파일)
// .env에 ANTHROPIC_API_KEY=sk-ant-xxxxx 형식으로 저장
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch'); // node 18 미만이면 필요. 18 이상은 삭제 가능

const app = express();
const PORT = 3001;

// React 앱(localhost:3000)의 요청을 허용
app.use(cors({ origin: /^http:\/\/localhost/ }));
app.use(express.json());

console.log('API 키 확인:', process.env.ANTHROPIC_API_KEY);

app.post('/api/chat', async function(req, res) {
  try {
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    var data = await response.json();

   if (!response.ok) {
  console.log('Anthropic 오류 응답:', JSON.stringify(data)); // 이 줄 추가
  return res.status(response.status).json(data);
}

    return res.json(data);

  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
});

app.listen(PORT, function() {
  console.log('프록시 서버 실행 중: http://localhost:' + PORT);
});
