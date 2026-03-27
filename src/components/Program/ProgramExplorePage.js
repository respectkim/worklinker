import React, { useState, useEffect } from 'react';
import './ProgramExplorePage.css';

// 가상의 추천 프로그램 데이터 (실제로는 백엔드 API에서 받아옵니다)
const MOCK_RECOMMENDATIONS = [
  {
    id: 'TRPR_1',
    title: '데이터 기반 의사결정 역량 강화 과정',
    institution: '한국공학대학교',
    region: '경기 시흥시',
    matchScore: 95,
    keywords: ['데이터분석', '의사결정 지원', '시각화'],
    isFree: true,
    ncsCode: '02030201' // 경영기획 관련 NCS
  },
  {
    id: 'TRPR_2',
    title: '스마트제조와 미래산업',
    institution: '한국산업인력공단',
    region: '경기 수원시',
    matchScore: 88,
    keywords: ['스마트제조', '자동화', '인공지능'],
    isFree: false,
    cost: 150000,
    ncsCode: '15010101' // 기계설계 관련 NCS
  },
  {
    id: 'TRPR_3',
    title: '[AI 능력자] 비개발자도 할 수 있는 바이브 코딩 업무 자동화',
    institution: '패스트캠퍼스',
    region: '온라인',
    matchScore: 82,
    keywords: ['업무자동화', '파이썬', '비개발자'],
    isFree: true,
    ncsCode: '20010202' // 응용SW 관련 NCS
  }
];



function ProgramExplorePage({ user }) {
  // 실제 환경에서는 user props가 상위 라우터에서 전달되어야 합니다.
  // 에러 방지를 위한 기본값 설정
  const currentUser = user || { 
    name: '김중장', 
    address: '경기도 시흥시', 
    targetJob: '데이터분석/사무자동화' 
  };

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchFilters, setSearchFilters] = useState({
    category: '전체',
    region: '전국',
    price: 'all',
    startDate: '',
    endDate: ''
    });
  const [sortOption, setSortOption] = useState('recommend'); // 기본값: 추천순

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
        setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // 💡 팩트 체크: 실제 개발 시 백엔드의 코사인 유사도 분석 API를 호출하는 로직이 들어갑니다.
    // fetch(`/api/recommend?job=${currentUser.targetJob}&region=${currentUser.address}`)
    
    // 임시 로딩 지연 효과 (UI 확인용)
    setTimeout(() => {
      setRecommendations(MOCK_RECOMMENDATIONS);
      setIsLoading(false);
    }, 800);
  }, [currentUser.targetJob, currentUser.address]);

  return (
    <div className="explore-page-container">
      {/* 1. 상단 사용자 프로필 요약 헤더 */}
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

      {/* 2. 맞춤 추천 결과 영역 */}
      <section className="recommendation-section">
        <div className="section-title">
          <h3>✨ AI 직무-키워드 매칭 추천</h3>
          <span className="subtitle">입력하신 관심 직무와 가장 유사도가 높은 순서입니다.</span>
        </div>

        {isLoading ? (
          <div className="loading-spinner">분석 중입니다...</div>
        ) : (
          <div className="cards-grid">
            {recommendations.map((program) => (
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
            ))}
          </div>
        )}
      </section>

      {/* 3. 전체 검색 필터 영역 (추가 탐색) */}
      <section className="search-section">
        <div className="section-title">
            <h3>🔍 더 많은 교육 찾아보기</h3>
        </div>
        
        <div className="filter-box">
            {/* 윗줄: 분야, 지역, 본인부담금 */}
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
                <option value="under_30">30만 원 미만</option>
                <option value="over_30">30만 원 이상</option>
            </select>
            </div>

            {/* 아랫줄: 시작일, 종료일, 검색 버튼 */}
            <div className="filter-group">
            <label>시작일 (이후)</label>
            <input 
                type="date" 
                name="startDate" 
                value={searchFilters.startDate} 
                onChange={handleSearchChange} 
            />
            </div>
            <div className="filter-group">
            <label>종료일 (이전)</label>
            <input 
                type="date" 
                name="endDate" 
                value={searchFilters.endDate} 
                onChange={handleSearchChange} 
            />
            </div>
            <div className="filter-group button-group">
            <button className="search-btn">조건 검색</button>
            </div>
        </div>
        
        {/* 검색 결과 정렬 및 목록 헤더 */}
        <div className="results-header">
            <span className="results-count">총 <strong>0</strong>개의 교육이 있습니다.</span>
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

        {/* 결과 목록이 들어갈 자리 */}
        <div className="empty-state">
            필터를 적용하여 새로운 교육을 탐색해 보세요.
        </div>
        </section>
    </div>
  );
}

export default ProgramExplorePage;