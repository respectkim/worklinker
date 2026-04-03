import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessWrite.css';
import CommonHeader from '../components/CommonHeader';

export default function SuccessWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    author: '',
    ageGroup: '50~54세',
    category: '사무·행정',
    job: '',
    period: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.author || !form.content) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    console.log('작성 데이터:', form);

    // 👉 나중에 서버 연결 예정

    alert('작성 완료!');
    navigate('/success');
  };

  return (
    <div className="success-write-layout">
      <CommonHeader />

      <div className="success-write-page">
        <div className="success-write-container">
          <h1 className="success-write-title">성공사례 작성</h1>

          <form className="success-write-form" onSubmit={handleSubmit}>
            
            <input
              name="title"
              placeholder="제목"
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="author"
              placeholder="작성자"
              value={form.author}
              onChange={handleChange}
            />

            <div className="row">
              <select name="ageGroup" value={form.ageGroup} onChange={handleChange}>
                <option>45~49세</option>
                <option>50~54세</option>
                <option>55~59세</option>
                <option>60~64세</option>
              </select>

              <select name="category" value={form.category} onChange={handleChange}>
                <option>사무·행정</option>
                <option>돌봄·복지</option>
                <option>물류·유통</option>
                <option>서비스</option>
                <option>시설·안전</option>
                <option>디지털·사무</option>
              </select>
            </div>

            <input
              name="job"
              placeholder="취업 직무"
              value={form.job}
              onChange={handleChange}
            />

            <input
              name="period"
              placeholder="취업까지 걸린 기간 (예: 3개월)"
              value={form.period}
              onChange={handleChange}
            />

            <textarea
              name="content"
              placeholder="성공 경험을 자세히 작성해주세요"
              value={form.content}
              onChange={handleChange}
              rows={10}
            />

            <div className="btns">
              <button type="button" onClick={() => navigate(-1)}>
                취소
              </button>

              <button type="submit" className="primary">
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}