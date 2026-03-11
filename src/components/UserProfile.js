import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./UserProfile.css";

export default function UserProfile({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 모바일 사이드바 상태
  const navigate = useNavigate();

  const jobInterests = ["IT 개발", "바리스타", "사회복지"];

  return (
    <>
      {/* 모바일용 상단 헤더 (375px 이하에서 노출) */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
        <div className="mobile-logo">WorkLinker</div>
      </header>

      {/* 사이드바 영역 */}
      <aside className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
                

        <div className="sidebar-top">
          <div className="welcome-box">
            <span className="user-status">🌱 씨앗</span>
            <motion.span 
              className="clickable-name"
              style={{cursor:'pointer'}}
              whileHover={{ scale: 1.05, color: "#60a5fa" }}
              onClick={() => { setIsModalOpen(true); setIsSidebarOpen(false); }}
            >
              {user?.id || "사용자"}
            </motion.span>님
          </div>
          <div className="mini-stats">
            방문 1회 | 0P
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="section-title">주제별 탐색</h4>
            <ul className="topic-list">
              {['🌐 전체', '💻 기술/IT', '☕ 서비스/카페', '🤝 복지/상담'].map((text, idx) => (
                <li key={idx} onClick={() => { navigate(`/contents?topic=${idx}`); setIsSidebarOpen(false); }}>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <h4 className="section-title">맞춤 취업 정보</h4>
            <div className="chip-container">
              {jobInterests.map((interest, idx) => (
                <button key={idx} className="interest-chip" onClick={() => { navigate(`/contents?search=${interest}`); setIsSidebarOpen(false); }}>
                  #{interest}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* 모바일 사이드바 열렸을 때 배경 어둡게 처리 */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* 개인정보 모달 (기존 코드 유지) */}
       {/*  UserProfile.js 내 모달 구조 부분 */ }
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>나의 성장 리포트</h3>
                <p className="modal-subtitle">WorkLinker와 함께한 기록입니다.</p>
              </div>

              <div className="info-grid">
                {/* 각 항목은 클릭 시 관련 페이지로 이동하는 버튼 역할을 합니다 */}
                <motion.div className="info-card" whileHover={{ y: -5 }} onClick={() => navigate("/mileage")}>
                  <span className="card-icon">🌲</span>
                  <div className="card-text">
                    <label>현재 레벨</label>
                    <p>열매 (3단계)</p>
                  </div>
                </motion.div>

                <motion.div className="info-card" whileHover={{ y: -5 }} onClick={() => navigate("/points")}>
                  <span className="card-icon">💎</span>
                  <div className="card-text">
                    <label>보유 포인트</label>
                    <p>1,250 P</p>
                  </div>
                </motion.div>

                <motion.div className="info-card" whileHover={{ y: -5 }}>
                  <span className="card-icon">📈</span>
                  <div className="card-text">
                    <label>총 방문 횟수</label>
                    <p>24회</p>
                  </div>
                </motion.div>

                <motion.div className="info-card" whileHover={{ y: -5 }} onClick={() => navigate("/bookshelf")}>
                  <span className="card-icon">📚</span>
                  <div className="card-text">
                    <label>학습 중인 콘텐츠</label>
                    <p>12개</p>
                  </div>
                </motion.div>
              </div>

              <div className="modal-footer">
                <button className="close-action-btn" onClick={() => setIsModalOpen(false)}>확인</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
