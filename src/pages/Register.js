import { useState } from 'react';
import api from '../api/api';
import './Register.css'

function Register() {
  const [form, setForm] = useState({
    id: '',
    password: '',
    purpose: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // ⚡ 경로 변경: /register → /auth/register
      const res = await api.post('/auth/register', form);
      alert(res.data.message);
    } catch (err) {
      alert('회원가입 실패');
    }
  };

  return (
    <div className="page">
      {/* 여기서 form-card 추가 */}
      <div className="form-card">
        <h2 className="member">회원가입</h2>

        <input name="id" placeholder="아이디" onChange={handleChange} />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
        />

        <textarea
          name="purpose"
          placeholder="가입 목적"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>가입</button>
      </div>
    </div>
  );
}

export default Register;