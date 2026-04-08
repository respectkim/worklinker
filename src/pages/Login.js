import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id.trim() || !form.password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        username: form.id.trim(),
        password: form.password,
      });

      alert(res.data.message || '로그인 성공');

      localStorage.setItem('worklinker_user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h2 className="member">로그인</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="id"
            placeholder="아이디"
            value={form.id}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}

export default Login;