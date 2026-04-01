import React from 'react';
import UserProfile from './UserProfile';
import './RightSidebar.css';

const RightSidebar = ({ user }) => {
  // PRD 논의사항: 취업 동향 및 뉴스 데이터 (예시)
  const newsItems = [
    { id: 1, title: "2026년 중장년 재취업 지원금 가이드", link: "#" },
    { id: 2, title: "서울시 50+ 재단: 디지털 튜터 양성 과정 모집", link: "#" },
    { id: 3, title: "은퇴 후 인기 있는 기술 자격증 TOP 5", link: "#" },
  ];

  // PRD 논의사항: 추천 취업 사이트
  const quickLinks = [
    { name: "워크넷(중장년)", url: "https://www.work.go.kr" },
    { name: "서울일자리포털", url: "https://job.seoul.go.kr" },
    { name: "국가자격 시험일정", url: "https://www.q-net.or.kr/crf021.do?id=crf02101&gSite=&gId=&scheType=01" },
  ];

  return (
    <aside className="right-sidebar">
      
      {/* 1. 사용자 프로필 영역 */}
      <section className="sidebar-section">
        <h2 className="section-title">내 정보</h2>
        <UserProfile user={user} />
      </section>

<<<<<<< HEAD
      {/* 2. 취업 동향 및 뉴스 (PRD 3.2 반영) */}
      {/* <section className="sidebar-section">
=======
      {/* 2. 취업 동향 및 뉴스 
      <section className="sidebar-section">
>>>>>>> main
        <h2 className="section-title">
          📢 취업 동향
        </h2>
        <ul className="news-list">
          {newsItems.map((news) => (
            <li key={news.id}>
              <a href={news.link} className="news-link" >
                 {news.title}
              </a>
            </li>
          ))}
        </ul>
      </section> */}

      {/* 3. 일자리 찾기 (세로 버튼형) */}
      <section className="sidebar-section">
        <h2 className="section-title">🔗 일자리 찾기</h2>
        <div className="link-list">
          {quickLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="job-link-button"
            >
              {link.name}
            </a>
          ))}
        </div>
      </section>

    </aside>
  );
};
export default RightSidebar;