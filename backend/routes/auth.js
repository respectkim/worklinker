
const router = require('express').Router();

router.post('/register', (req, res) => {
  console.log('🔥 REGISTER HIT');
  console.log(req.body);

  res.json({ message: '회원가입 성공' }); // 회원가입 시 터미널에 출력
});

module.exports = router;

// const express = require('express');
// const router = express.Router();

// router.post('/register', (req, res) => {
//   console.log('REGISTER BODY:', req.body); // 디버깅용
//   res.json({ message: '회원가입 성공' });
// });

// router.post('/login', (req, res) => {
//   res.json({ message: '로그인 성공' });
// });

// module.exports = router;