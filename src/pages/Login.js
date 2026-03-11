import { useState } from 'react';
import api from '../api/api';
import './Login.css'; // Register와 동일한 CSS 컨벤션 적용

function Login() {
  const [form, setForm] = useState({
    id: '',
    password: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await api.post('/login', form);
      alert(res.data.message);
      // 로그인 성공 시 Home 이동 로직 추가 가능
    } catch (err) {
      alert('아이디 또는 비밀번호가 올바르지 않습니다');
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h2 className="member">로그인</h2>

        <input
          name="id"
          placeholder="아이디"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>로그인</button>
      </div>
    </div>
  );
}

export default Login;