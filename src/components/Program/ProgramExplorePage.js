import React, { useState, useEffect } from 'react';
import './ProgramExplorePage.css';

const MOCK_RECOMMENDATIONS = [
  {
    id: 'TRPR_1',
    title: '데이터 기반 의사결정 역량 강화 과정',
    institution: '한국공학대학교',
    region: '경기 시흥시',
    matchScore: 95,
    keywords: ['데이터분석', '의사결정 지원', '시각화'],
    isFree: true,
    ncsCode: '02030201',
    tags: ['hybrid', 'job', 'region'] 
  },
  {
    id: 'TRPR_2',
    title: '비전공자를 위한 파이썬 자동화 사무 업무',
    institution: '이젠아카데미',
    region: '서울 강남구',
    matchScore: 88,
    keywords: ['업무자동화', '파이썬', '사무/행정'],
    isFree: false,
    cost: 150000,
    ncsCode: '15010101',
    tags: ['job'] 
  },
  {
    id: 'TRPR_3',
    title: '시흥시 스마트제조 AI 시스템 관리자 양성',
    institution: '한국산업인력공단',
    region: '경기 시흥시',
    matchScore: 82,
    keywords: ['스마트제조', '자동화', '지역특화'],
    isFree: true,
    ncsCode: '20010202',
    tags: ['hybrid', 'region'] 
  }
];

function ProgramExplorePage({ user }) {
  const currentUser = user || { 
    name: '김중장', 
    address: '경기도 시흥시', 
    targetJob: '데이터분석/사무자동화' 
  };

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hybrid');

  const [searchFilters, setSearchFilters] = useState({
    category: '전체', region: '전국', price: 'all', startDate: '', endDate: ''
  });
  const [sortOption, setSortOption] = useState('recommend');

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRecommendations(MOCK_RECOMMENDATIONS);
      setIsLoading(false);
    }, 600);
  }, [currentUser.targetJob, currentUser.address]);

  const filteredRecommendations = recommendations.filter(program => 
    program.tags && program.tags.includes(activeTab)
  );

  return (
    <div className="explore-page-container">
      <header className="explore-header">
        <div className="user-context">
          <h2>맞춤 교육 프로그램 탐색</h2>
          <p>
            <strong>{currentUser.name}</strong>님이 희망하시는 
            <span className="highlight-text"> [{currentUser.targetJob}]</span> 직무와 
            <span className="highlight-text"> [{currentUser.address}]</span> 인근의 교육을 분석했습니다.
          </p>
        </div>
      </header>

      <section className="recommendation-section">
        <div className="recommend-tabs">
          <button 
            className={`tab-btn ${activeTab === 'hybrid' ? 'active' : ''}`}
            onClick={() => setActiveTab('hybrid')}
          >
            🔥 찰떡 맞춤 <span className="tab-sub">(직무 + 지역)</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'job' ? 'active' : ''}`}
            onClick={() => setActiveTab('job')}
          >
            💼 직무 집중 <span className="tab-sub">(거리 무관)</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'region' ? 'active' : ''}`}
            onClick={() => setActiveTab('region')}
          >
            🏠 가까운 거리 <span className="tab-sub">(내 주변)</span>
          </button>
        </div>

        <div className="section-title">
          <h3>✨ AI 맞춤 추천 결과</h3>
          <span className="subtitle">
            {activeTab === 'hybrid' && '직무 연관성이 높고 집에서 가까운 과정입니다.'}
            {activeTab === 'job' && '거리에 상관없이 원하시는 직무와 가장 일치하는 과정입니다.'}
            {activeTab === 'region' && '직무와 조금 다르더라도 집에서 가장 가까운 과정입니다.'}
          </span>
        </div>

        {isLoading ? (
          <div className="loading-spinner">분석 중입니다...</div>
        ) : (
          <div className="cards-grid">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((program) => (
                <div key={program.id} className="program-card">
                  <div className="card-top">
                    <span className="match-badge">적합도 {program.matchScore}%</span>
                    <span className={`cost-badge ${program.isFree ? 'free' : 'paid'}`}>
                      {program.isFree ? '전액지원' : `${program.cost.toLocaleString()}원`}
                    </span>
                  </div>
                  
                  <h4 className="program-title">{program.title}</h4>
                  <p className="program-info">
                    <span className="icon">🏢</span> {program.institution} <br/>
                    <span className="icon">📍</span> {program.region}
                  </p>

                  <div className="keyword-tags">
                    {program.keywords.map((kw, idx) => (
                      <span key={idx} className="tag">#{kw}</span>
                    ))}
                  </div>

                  <div className="card-action">
                    <button className="detail-btn">상세 보기</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                현재 선택하신 조건에 맞는 훈련 과정이 없습니다.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="search-section">
        <div className="section-title">
            <h3>🔍 더 많은 교육 찾아보기</h3>
        </div>
        
        <div className="filter-box">
            <div className="filter-group">
              <label>분야 선택</label>
              <select name="category" value={searchFilters.category} onChange={handleSearchChange}>
                  <option value="전체">전체</option>
                  <option value="인공지능">인공지능</option>
                  <option value="빅데이터">빅데이터</option>
                  <option value="스마트제조">스마트제조</option>
              </select>
            </div>
            <div className="filter-group">
              <label>지역 선택</label>
              <select name="region" value={searchFilters.region} onChange={handleSearchChange}>
                  <option value="전국">전국</option>
                  <option value="서울">서울</option>
                  <option value="경기">경기</option>
              </select>
            </div>
            <div className="filter-group">
              <label>본인 부담액</label>
              <select name="price" value={searchFilters.price} onChange={handleSearchChange}>
                  <option value="all">금액 전체</option>
                  <option value="free">전액 무료 (0원)</option>
                  <option value="under_10">10만 원 미만</option>
              </select>
            </div>
            <div className="filter-group button-group" style={{ gridColumn: '3', gridRow: '2' }}>
              <button className="search-btn">조건 검색</button>
            </div>
        </div>
        
        <div className="results-header">
            <span className="results-count">총 <strong>0</strong>개의 교육이 있습니다.</span>
            <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="recommend">✨ AI 추천순</option>
              <option value="price_asc">💸 금액 낮은 순</option>
              <option value="date_asc">📅 시작일 빠른 순</option>
            </select>
        </div>

        <div className="empty-state">
            필터를 적용하여 새로운 교육을 탐색해 보세요.
        </div>
      </section>
    </div>
  );
}

export default ProgramExplorePage;