import { useState } from 'react';
import api from '../api/api';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    userName: '',
    ssn1: '', ssn2: '',
    phone: '', carrier: '',
    id: '',
    password: '', confirmPassword: '',
    emailId: '', emailDomain: '',
    zipcode: '', address: '', addressDetail: '',
    selectedJobs: [] // 데이터 분석용 관심 직무
  });

  const jobCategories = [
    { id: 'job1', icon: '🏠', name: '시설관리/경비' },
    { id: 'job2', icon: '🚚', name: '운전/배송' },
    { id: 'job3', icon: '🧹', name: '청소/가사' },
    { id: 'job4', icon: '🍳', name: '조리/외식' },
    { id: 'job5', icon: '💻', name: 'IT/데이터' },
    { id: 'job6', icon: '🏢', name: '사무보조' },
    { id: 'job7', icon: '🛒', name: '유통/물류' },
    { id: 'job8', icon: '🏥', name: '간병/요양' },
    { id: 'job9', icon: '👩‍🏫', name: '강사/교육' },
    { id: 'job10', icon: '🛠️', name: '생산/현장' },
    { id: 'job11', icon: '🎨', name: '수작업/부업' },
    { id: 'job12', icon: '📞', name: '상담/서비스' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleJobSelect = (jobName) => {
    setForm(prev => {
      const isSelected = prev.selectedJobs.includes(jobName);
      if (isSelected) {
        return { ...prev, selectedJobs: prev.selectedJobs.filter(item => item !== jobName) };
      } else {
        if (prev.selectedJobs.length >= 3) {
          alert("관심 직무는 최대 3개까지만 선택 가능합니다.");
          return prev;
        }
        return { ...prev, selectedJobs: [...prev.selectedJobs, jobName] };
      }
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm(prev => ({ ...prev, zipcode: data.zonecode, address: data.address }));
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.selectedJobs.length < 3) {
      alert('정확한 맞춤 추천을 위해 관심 직무를 ☆3개☆ 꼭 선택해 주세요.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await api.post('/auth/register', form);
      alert('회원가입이 완료되었습니다!');
    } catch (err) {
      alert('회원가입 실패');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="title">회원가입</h2>
        <form onSubmit={handleSubmit} className="register-form">
          
          <div className="form-group">
            <label>이름</label>
            <input name="userName" placeholder="이름을 입력해주세요" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>주민번호</label>
            <div className="ssn-row">
              <input name="ssn1" placeholder="앞자리" maxLength="6" onChange={handleChange} />
              <span>-</span>
              <div className="ssn-back">
                <input name="ssn2" className="ssn-digit" maxLength="1" onChange={handleChange} />
                <span className="dots">●●●●●●</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>휴대폰 번호</label>
            <div className="phone-row">
              <input name="phone" placeholder="숫자만 입력" onChange={handleChange} />
              <select name="carrier" onChange={handleChange} className="carrier-select">
                <option value="">통신사</option>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LGU">LG U+</option>
              </select>
              <button type="button" className="btn-small">인증요청</button>
            </div>
          </div>

          <div className="form-group">
            <label>아이디</label>
            <div className="dual-row">
              <input name="id" placeholder="아이디 입력" onChange={handleChange} />
              <button type="button" className="btn-small">중복확인</button>
            </div>
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호 입력" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" placeholder="비밀번호 재입력" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>이메일 주소</label>
            <div className="email-row">
              <input name="emailId" placeholder="이메일 아이디" onChange={handleChange} />
              <span>@</span>
              <input name="emailDomain" placeholder="도메인 입력" onChange={handleChange} />
            </div>
          </div>

          <hr className="divider" />

          {/* 🕹️ 관심 직무 분야 섹션 */}
          <div className="form-group">
            <label className="job-label">
              ☆ 관심 직무 분야 ☆ <span className="highlight-text">(필수 3개 선택)</span>
            </label>
            <p className="job-desc">※ 맞춤형 일자리 데이터 분석을 위해 필수 선택이 필요합니다.</p>
            <div className="job-grid">
              {jobCategories.map((job) => (
                <div 
                  key={job.id} 
                  className={`job-item ${form.selectedJobs.includes(job.name) ? 'active' : ''}`}
                  onClick={() => handleJobSelect(job.name)}
                >
                  <span className="job-icon">{job.icon}</span>
                  <span className="job-text">{job.name}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          <div className="form-group">
            <label>주소</label>
            <div className="address-container">
              <div className="zipcode-row">
                <input name="zipcode" value={form.zipcode} placeholder="우편번호" readOnly />
                <button type="button" className="btn-search" onClick={handleAddressSearch}>우편번호 찾기</button>
              </div>
              <input name="address" value={form.address} placeholder="기본 주소" readOnly />
              <input name="addressDetail" placeholder="상세 주소를 입력해주세요" onChange={handleChange} />
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="terms-container">
            <label className="term-item main-term">
              <input type="checkbox" /><span>전체 동의합니다.</span>
            </label>
            <div className="term-divider"></div>
            <div className="term-list">
              <label className="term-item"><input type="checkbox" /><span>[필수] 만 19세 이상입니다. <span className="star">★</span></span></label>
              <label className="term-item"><input type="checkbox" /><span>[필수] 서비스 이용 약관 <span className="star">★</span></span></label>
              <label className="term-item"><input type="checkbox" /><span>[필수] 개인정보 수집 이용동의 <span className="star">★</span></span></label>
            </div>
          </div>

          <button type="submit" className="btn-submit">회원가입하기</button>
        </form>
      </div>
    </div>
  );
}

export default Register;