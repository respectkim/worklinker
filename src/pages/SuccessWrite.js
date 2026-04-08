import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessWrite.css';
import CommonHeader from '../components/CommonHeader';

export default function SuccessWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: '사무·행정',
    job: '',
    period: '',
    summary: '',
    content: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.job.trim() ||
      !form.content.trim()
    ) {
      alert('제목, 카테고리, 직무, 내용은 필수입니다.');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch('http://127.0.0.1:5000/api/success/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          category_id: null,
          title: form.title.trim(),
          category: form.category,
          job: form.job.trim(),
          period: form.period.trim(),
          summary: form.summary.trim(),
          content: form.content.trim(),
          featured: false,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || '게시글 등록에 실패했습니다.');
      }

      alert('작성 완료!');
      navigate('/success');
    } catch (err) {
      console.error(err);
      alert(err.message || '서버 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
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

            <div className="row">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="사무·행정">사무·행정</option>
                <option value="돌봄·복지">돌봄·복지</option>
                <option value="물류·유통">물류·유통</option>
                <option value="서비스">서비스</option>
                <option value="시설·안전">시설·안전</option>
                <option value="디지털·사무">디지털·사무</option>
              </select>

              <input
                name="job"
                placeholder="취업 직무"
                value={form.job}
                onChange={handleChange}
              />
            </div>

            <input
              name="period"
              placeholder="취업까지 걸린 기간 (예: 3개월)"
              value={form.period}
              onChange={handleChange}
            />

            <input
              name="summary"
              placeholder="요약 문장"
              value={form.summary}
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

              <button type="submit" className="primary" disabled={submitting}>
                {submitting ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}