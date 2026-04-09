import React, { useState, useEffect } from 'react';
import api from '../../api/api'; 
import './ProgramExplorePage.css';

function ProgramExplorePage() {
  // 1. 필요한 모든 상태(State) 장착 완료
  const [recommendations, setRecommendations] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ region: '전국', price: 'all' });
  const [sortOption, setSortOption] = useState('recommend');
  const [activeTab, setActiveTab] = useState('recommend'); 
  const [isLoading, setIsLoading] = useState(false);       
  const [currentUser, setCurrentUser] = useState({         
    name: "김중장",
    targetJob: ["인공지능학습데이터구축"],
    address: '서울',
    selectedJobs: ['인공지능학습데이터구축']
  });

  const filteredRecommendations = recommendations;
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  // 🚨 2. 백엔드에 데이터를 달라고 조르는 핵심 함수
  const fetchRecommendations = async () => {
    // setIsLoading(true); 
    try {
      console.log("백엔드로 데이터 요청 발사!"); // 콘솔 확인용
      const response = await api.post('/ml/explore', {
        region: searchFilters.region,
        price: searchFilters.price,
        sortOption: sortOption
      });
      console.log("백엔드에서 데이터 도착:", response.data);
      setRecommendations(response.data); 
    } catch (error) {
      console.error("통신 실패:", error);
    } finally {
      // setIsLoading(false); 
    }
  };

  // 🚨 3. [가장 중요] 화면이 처음 렌더링될 때 딱 1번 자동으로 전화를 걸게 만드는 스위치
  useEffect(() => {
    fetchRecommendations();
  }, [sortOption]); // 정렬 조건이 바뀔 때마다 다시 요청

  // 🚨 새롭게 추가된 로직: 관심직무 우선 매칭 & 4개 컷오프 함수
  const getTopKeywords = (keywords, userJobs) => {
    if (!keywords || !Array.isArray(keywords)) return [];
    
    // 1. 유저 관심 직무와 단어가 겹치는 키워드 우선 추출
    const matched = keywords.filter(kw => 
      userJobs.some(job => job.includes(kw) || kw.includes(job))
    );
    
    // 2. 겹치지 않는 나머지 키워드
    const others = keywords.filter(kw => !matched.includes(kw));
    
    // 3. 매칭된 것을 맨 앞에 세우고, 나머지를 이어붙인 뒤 딱 4개만 잘라서 반환
    return [...matched, ...others].slice(0, 4);
  };

  // 검색 버튼용
  const handleSearch = () => {
    fetchRecommendations();
  };

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
                    {getTopKeywords(program.keywords, currentUser.selectedJobs).map((kw, idx) => (
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
    
      {/* 🚨 지도 컴포넌트는 리스트가 완벽히 출력될 때까지 임시 주석 처리! */}
      {/* <KakaoMap data={recommendations} /> */}
    </div>
  );
}

export default ProgramExplorePage;