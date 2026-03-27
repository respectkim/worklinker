import React, { useState } from "react"; // 🚨 핵심: useState 추가
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // 닫기 아이콘
import "./UserProfile.css";

export default function UserProfile({ user }) {
  const navigate = useNavigate();
  
  // 🚨 1. 팝업(모달)의 열림/닫힘 상태를 관리하는 변수
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🚨 2. 화면에 뿌려줄 더미 교육 데이터 배열
  const dummyCourses = [
    { id: 1, title: '시니어 디지털 튜터 양성과정', provider: '서울시 50+ 재단', status: '수강중' },
    { id: 2, title: '바리스타 2급 실기 특강', provider: '내일배움센터', status: '수강대기' },
  ];

  const activityScore = user?.mileage || 0;
  // 기존의 숫자 1 대신, 더미 데이터의 개수를 가져와서 표시합니다.
  const courseCount = dummyCourses.length; 

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div className="user-profile">
        {/* 상단 프로필 헤더 (기존 코드 유지) */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.id?.charAt(0).toUpperCase() || "M"}
          </div>
          <div className="user-text-group">
            <div className="user-id">{user?.id || "사용자"} 님</div>
            <div className="user-welcome">반가워요! 오늘도 응원합니다.</div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="profile-info">
          <div className="info-line">
            <span>수강 중인 교육</span>
            {/* 🚨 3. a 태그 대신 onClick을 사용하여 팝업 상태를 true로 바꿉니다 */}
            <strong 
              className="clickable-count" 
              onClick={() => setIsModalOpen(true)}
            >
              {courseCount}개
            </strong>
          </div>
        </div>

        {/* 로그아웃 버튼 (기존 유지) */}
        <button className="logout-btn" onClick={logout}>로그아웃</button>
      </div>

      {/* 🚨 4. 팝업(모달) 화면 영역 (isModalOpen이 true일 때만 화면에 나타남) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          {/* 모달 내부 클릭 시 닫히지 않도록 이벤트 전파(e.stopPropagation) 차단 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>수강 중인 교육 리스트</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} color="#cbd5e1" />
              </button>
            </div>
            
            <ul className="course-list">
              {dummyCourses.map((course) => (
                <li key={course.id} className="course-item">
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <p>{course.provider}</p>
                  </div>
                  <span className={`status-badge ${course.status === '수강중' ? 'active' : ''}`}>
                    {course.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}