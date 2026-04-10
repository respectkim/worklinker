import React, { useState, useEffect } from 'react';
import api from '../../api/api'; 
import './ProgramExplorePage.css';

function ProgramExplorePage() {
  // 1. 필요한 모든 상태(State) 장착 완료
  const [recommendations, setRecommendations] = useState([]);
  const [sortOption, setSortOption] = useState('recommend');
  const [activeTab, setActiveTab] = useState('recommend'); 
  const [isLoading, setIsLoading] = useState(false);       
  const [currentUser, setCurrentUser]= useState(null);
  const [searchFilters, setSearchFilters]= useState({
    category:"전체",
    region:"전국",
    price:"all",
  });

  const filteredRecommendations = recommendations;
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  // 🚨 2. 백엔드에 데이터를 달라고 조르는 핵심 함수
  const fetchRecommendations = async () => {
    if (!currentUser?.selectedJobs?.length) {
      setRecommendations([]);
      return;
    }

  setIsLoading(true);
  try {
    const response = await api.post('/ml/explore', {
      userId: currentUser.id,
      selectedJobs: currentUser.selectedJobs,
      region: searchFilters.region,
      category: searchFilters.category,
      price: searchFilters.price,
      sortOption,
      mode: activeTab,
    });

    setRecommendations(response.data.recommendations || []);
  } catch (error) {
    console.error('추천 교육 통신 실패:', error);
    setRecommendations([]);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    const bootstrap = async () => {
      const savedUser = localStorage.getItem('worklinker_user');

      if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
        setCurrentUser(null);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);

        const res = await api.get(`/auth/user/${parsedUser.id}/preferences`);

        if (!res.data.ok) {
          throw new Error(res.data.error || '직무 선호 정보를 불러오지 못했습니다.');
        }

        const jobs = res.data.preferences || [];

        setCurrentUser({
          id: parsedUser.id,
          name: parsedUser.username,
          targetJob: jobs,
          selectedJobs: jobs,
          address: searchFilters.region || '전국',
        });
      } catch (error) {
        console.error('추천교육 초기화 실패:', error);
        localStorage.removeItem('worklinker_user');
        setCurrentUser(null);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (currentUser?.selectedJobs?.length) {
      fetchRecommendations();
    }
  }, [currentUser, sortOption, activeTab]);

    const getTopKeywords = (keywords, userJobs) => {
      if (!keywords || !Array.isArray(keywords)) return [];

    const matched = keywords.filter((kw) =>
      userJobs.some((job) => job.includes(kw) || kw.includes(job))
    );

    const others = keywords.filter((kw) => !matched.includes(kw));

    return [...matched, ...others].slice(0, 4);
  };

    const handleSearch = () => {
      fetchRecommendations();
  };

    const handlePreferenceClick = (tabKey) => {
      setActiveTab(tabKey);
  };


  return (
    <div className="explore-page-container">
      <header className="explore-header">
        <div className="user-context">
          <h2>맞춤 교육 프로그램 탐색</h2>
          <p>
            <strong>{currentUser?.name || '사용자'}</strong>님이 희망하시는 
            <span className="highlight-text">
              {' '}
              [{(currentUser?.targetJob || []).join(', ') || '관심 직무 없음'}]
            </span>
            {' '}직무와
            <span className="highlight-text"> [{searchFilters.region}]</span>
            {' '}조건을 기준으로 교육을 분석했습니다.
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
                    {getTopKeywords(program.keywords, currentUser?.selectedJobs || []).map(
                      (kw, idx) => (
                        <span key={idx} className="tag">
                          #{kw}
                        </span>
                      )
                    )}
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
            <span className="results-count">
             총 <strong>{recommendations.length}</strong>개의 교육이 있습니다.
          </span>

          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
              <option value="recommend">✨ AI 추천순</option>
              <option value="price_asc">💸 금액 낮은 순</option>
              <option value="date_asc">📅 시작일 빠른 순</option>
            </select>
        </div>

        {/* <div className="empty-state">
            필터를 적용하여 새로운 교육을 탐색해 보세요.
        </div> */}
      </section>
    
      {/* 🚨 지도 컴포넌트는 리스트가 완벽히 출력될 때까지 임시 주석 처리! */}
      {/* <KakaoMap data={recommendations} /> */}
    </div>
  );
}

export default ProgramExplorePage;