// server.js — 프록시 서버 (프로젝트 루트에 위치)
// 실행: node server.js
// API 키는 서버에서만 관리 (.env 파일)
// .env에 ANTHROPIC_API_KEY=sk-ant-xxxxx 형식으로 저장
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { AwardIcon, MessageSquareText } = require('lucide-react');
// const fetch = require('node-fetch'); // node 18 미만이면 필요. 18 이상은 삭제 가능

const app = express();
const PORT = 3001;

// 일단 모든 통신 열어두기
app.use(cors({ origin: '*' }));
app.use(express.json());

console.log('✅ Anthropic API 키 로드 완료');

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


// 🚨 유튜브 API 범용 스마트 프록시 라우터 (에러 추적 완결판)
app.get('/api/youtube/:endpoint', async function(req, res) {
  try {
    var endpoint = req.params.endpoint;
    var youtubeUrl = `https://www.googleapis.com/youtube/v3/${endpoint}?key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;

    if (endpoint === 'search') {
      var q = req.query.q || '';
      var order = req.query.order || 'relevance';
      var pageToken = req.query.pageToken || '';

      youtubeUrl += `&part=snippet&maxResults=50&type=video&q=${encodeURIComponent(q)}&order=${order}`;
      if (pageToken) youtubeUrl += `&pageToken=${pageToken}`;

    } else if (endpoint === 'videos') {
      var id = req.query.id || '';
      
      if (!id) {
        console.log('❌ [서버 경고] 프론트엔드에서 ID를 받지 못했습니다.');
        return res.status(400).json({ error: { message: "ID가 전달되지 않았습니다." } });
      }
      
      // 🚨 핵심: 쉼표(,)를 포함한 ID 덩어리를 구글이 절대 오해하지 못하도록 안전하게 포장(encode)
      youtubeUrl += `&part=snippet,statistics&id=${encodeURIComponent(id)}`;
    }

    console.log(`\n[요청 전송] 구글 API로 통신 시작: ${endpoint}`);
    var response = await fetch(youtubeUrl);
    var data = await response.json();

    if (!response.ok) {
      // 🚨 구글이 400 에러를 뱉은 '진짜 이유'를 백엔드 터미널에 적나라하게 출력합니다.
      console.error('❌ [구글 API 거절 사유]:', JSON.stringify(data, null, 2));
      return res.status(response.status).json(data);
    }

    console.log(`✅ [데이터 로드 성공]: ${endpoint} (결과 개수: ${data.items ? data.items.length : 0}개)`);
    return res.json(data);

  } catch (error) {
    console.error('❌ [서버 내부 에러]:', error);
    return res.status(500).json({ error: { message: error.message } });
  }
});
app.listen(PORT, function() {
  console.log('🚀 AWS 프록시 서버 무한 구동 중 (포트: ' + PORT + ')');
});
