const User = require('../models/User');

const users = []; // 임시 메모리 저장소

exports.register = (req, res) => {
  const { id, password, purpose } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: '필수값 누락' });
  }

  const newUser = new User({ id, password, purpose });
  users.push(newUser);

  res.status(201).json({
    message: '회원가입 성공',
    user: { id: newUser.id, purpose: newUser.purpose }
  });
};

exports.login = (req, res) => {
  const { id, password } = req.body;

  const user = users.find(u => u.id === id && u.password === password);

  if (!user) {
    return res.status(401).json({ message: '로그인 실패' });
  }

  res.json({
    message: '로그인 성공',
    user: { id: user.id }
  });
};