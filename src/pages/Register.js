import React, { useState } from 'react';
import api from '../api/api';
import DaumPostcode from 'react-daum-postcode';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    userName: '', ssn1: '', ssn2: '',
    phone: '', id: '', password: '', confirmPassword: '',
    emailId: '', emailDomain: '',
    zipcode: '', address: '', addressDetail: '',
    selectedJobs: [] 
  });

  const [isIdVerified, setIsIdVerified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('IT_AI');
  const [isOpenPostcode, setIsOpenPostcode] = useState(false);

  const mainCategories = [
    { id: 'OFFICE', name: '경영·사무' },
    { id: 'HEALTH', name: '보건·복지' },
    { id: 'PRODUCTION', name: '기계·생산' },
    { id: 'CONSTRUCTION', name: '건설·건축' },
    { id: 'IT_AI', name: 'IT·인공지능' } 
  ];

  const jobCategories = [
    { id: 'job1', category: 'IT_AI', icon: '💻', name: '인공지능학습데이터구축' },
    { id: 'job2', category: 'IT_AI', icon: '💡', name: '인공지능서비스기획' },
    { id: 'job3', category: 'IT_AI', icon: '📊', name: '빅데이터분석' },
    { id: 'job4', category: 'IT_AI', icon: '⚙️', name: '데이터엔지니어링' },
    { id: 'job5', category: 'IT_AI', icon: '🧠', name: '인공지능모델링' },
    { id: 'job6', category: 'IT_AI', icon: '⌨️', name: '응용SW엔지니어링' },
  ];

  const consultantComments = {
    '인공지능학습데이터구축': "💡 [컨설턴트 코멘트] 이른바 '데이터 라벨링'으로 불리는 직무입니다. 고도의 코딩 지식보다는 꼼꼼함과 데이터 전처리 역량이 필수적입니다. 진입 장벽이 상대적으로 낮아 IT 분야로의 빠른 재취업을 희망하시는 분들께 가장 현실적이고 강력히 추천하는 분야입니다.",
    '인공지능서비스기획': "💡 [컨설턴트 코멘트] 개발을 직접 하기보다는 AI 기술을 활용해 어떤 서비스를 만들지 설계하는 역할입니다. 프로그래밍 지식보다 기존에 쌓아오신 풍부한 사회 경험(영업, 경영, 제조 등)과 AI를 접목할 수 있어, 이전 경력을 십분 살릴 수 있는 매력적인 직무입니다.",
    '빅데이터분석': "💡 [컨설턴트 코멘트] 수많은 데이터 속에서 의미 있는 패턴과 결과를 찾아내는 직무입니다. 파이썬이나 엑셀을 활용한 데이터 가공 및 시각화 역량이 필요합니다. 현재 모든 산업군에서 데이터 분석 역량을 요구하고 있어 취업 시장에서 수요가 매우 높습니다.",
    '데이터엔지니어링': "💡 [컨설턴트 코멘트] 데이터가 원활하게 수집되고 저장될 수 있도록 인프라(뼈대)를 구축하는 직무입니다. 데이터 분석 자체보다는 서버 구축이나 데이터베이스(DB) 관리에 흥미가 있는 분들에게 적합한 시스템 기반 직무입니다.",
    '인공지능모델링': "💡 [컨설턴트 코멘트] 딥러닝과 머신러닝 알고리즘을 직접 설계하고 AI를 학습시키는 심화 직무입니다. 수학적 사고력과 파이썬 프로그래밍에 대한 깊은 이해가 요구됩니다. 학습에 시간과 노력이 필요하지만, 그만큼 고도의 전문성을 인정받을 수 있습니다.",
    '응용SW엔지니어링': "💡 [컨설턴트 코멘트] 우리가 흔히 사용하는 웹사이트나 스마트폰 앱을 개발하는 전통적인 소프트웨어 개발 직무입니다. 자바(Java)나 스프링(Spring) 등의 프로그래밍 언어와 프레임워크 활용 역량이 필수적으로 요구됩니다."
  };

  const handleAddressSearch = () => {
    setIsOpenPostcode(true);
  };

  const handleCompletePostcode = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      if (extraAddress !== '') {
        fullAddress += ` (${extraAddress})`;
      }
    }

    setForm({
      ...form,
      zipcode: data.zonecode,
      address: fullAddress,
    });
    setIsOpenPostcode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'id') {
      setIsIdVerified(false);
    }
  };

  const handleCheckId = async () => {
    if (!form.id.trim()) {
      alert('아이디를 먼저 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/api/check-id', { id: form.id });
      if (response.data.status === 'available') {
        alert('사용 가능한 아이디입니다.');
        setIsIdVerified(true);
      } else {
        alert('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
        setIsIdVerified(false);
      }
    } catch (error) {
      console.error("중복확인 에러:", error);
      alert('서버 통신에 실패했습니다. 백엔드 서버 작동 및 CORS 설정을 확인해주세요.');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdVerified) {
      alert('아이디 중복확인을 진행해주세요.');
      return;
    }
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

  const modalStyle = {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '400px', height: '500px', backgroundColor: 'white',
    border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000,
  };

  const backdropStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
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
              <input name="phone" placeholder="XXX-XXXX-XXXX 형태로 입력" onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>아이디</label>
            <div className="dual-row">
              <input 
                name="id" 
                placeholder="아이디 입력" 
                onChange={handleChange} 
                style={{borderColor:isIdVerified ? '#10b981' : '#475569'}}
              />
              <button 
                type="button" 
                className="btn-small"
                onClick={handleCheckId}
                style={{backgroundColor: isIdVerified ? '#10b981' : '#334155'}}
              > {isIdVerified ? '확인완료' : '중복확인'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호 입력" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="비밀번호 재입력" 
              onChange={handleChange} 
              style={{
                borderColor: form.confirmPassword 
                  ? (form.password === form.confirmPassword ? '#10b981' : '#ef4444') 
                  : '#475569'
              }}
            />
            {/* 🚨 실시간 비밀번호 일치 여부 피드백 UI 추가 */}
            {form.confirmPassword && (
              <span className={`password-match-msg ${form.password === form.confirmPassword ? 'success' : 'error'}`}>
                {form.password === form.confirmPassword 
                  ? '✅ 비밀번호가 일치합니다.' 
                  : '❌ 비밀번호가 일치하지 않습니다.'}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>이메일 주소</label>
            <div className="email-row">
              <input name="emailId" placeholder="이메일 아이디" onChange={handleChange} />
              <span>@</span>
              <input name="emailDomain" placeholder="도메인 입력" onChange={handleChange} />
            </div>
          </div>
          
          {/* 🕹️ 관심 직무 분야 섹션 */}
          <div className="job-selection-wrapper">
            <label className="job-label">
              ☆ 관심 직무 분야 ☆ <span className="highlight-text">(최대 3개 선택)</span>
            </label>
            <p className="job-desc">※ 선택하신 직무를 바탕으로 최적의 훈련 과정을 분석합니다.</p>

            <div className="category-tabs">
              {mainCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="job-grid">
              {selectedCategory === 'IT_AI' ? (
                jobCategories.filter(job => job.category === selectedCategory).map((job) => (
                  <div
                    key={job.id}
                    className={`job-item ${form.selectedJobs.includes(job.name) ? 'active' : ''}`}
                    onClick={() => handleJobSelect(job.name)}
                  >
                    <span className="job-icon">{job.icon}</span>
                    <span className="job-text">{job.name}</span>
                  </div>
                ))
              ) : (
                <div className="coming-soon-card">
                  <span className="icon">🚧</span>
                  <h4>해당 분야의<br />맞춤형 훈련 데이터는<br />현재 준비 중입니다.</h4>
                  <p>
                    초기 서비스는 데이터가 가장 많이 확보된 <b>'IT·인공지능'</b> 분야를 중심으로 제공됩니다.<br /><br />
                    상단의 <b>[IT·인공지능]</b> 탭을 눌러 서비스를 체험해 보세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          {form.selectedJobs.length > 0 && (
            <div className="consultant-feedback-area">
              <h4><span>🧑‍💼</span> AI 취업 컨설턴트의 직무 분석</h4>
              {form.selectedJobs.map(jobName => (
                <div key={jobName} className="feedback-item">
                  <strong>📌 {jobName}</strong>
                  <p>
                    <span className="dynamic-text">
                      {form.address ? `입력하신 [ ${form.address.split(' ')[1] || '해당'} ] 지역을 중심으로 분석한 결과입니다. ` : ''}
                    </span>
                    {consultantComments[jobName]}
                  </p>
                </div>
              ))}
            </div>
          )}

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

        {isOpenPostcode && (
          <div>
            <div style={backdropStyle} onClick={() => setIsOpenPostcode(false)}></div>
            <div style={modalStyle}>
              <DaumPostcode autoClose={false} onComplete={handleCompletePostcode} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;