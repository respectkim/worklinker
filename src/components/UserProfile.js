import React, { useState } from "react"; // 🚨 핵심: useState 추가
import { useNavigate } from "react-router-dom";
import { X, User, Mail, Phone } from "lucide-react"; // 닫기 아이콘
import "./UserProfile.css";

export default function UserProfile({ user }) {
  const navigate = useNavigate();
  
  // 🚨 1. 팝업(모달)의 열림/닫힘 상태를 관리하는 변수
  const [isModalOpen, setIsModalOpen] = useState(false);

  // (추가) 정보수정 모달
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // 🚨 2. 화면에 뿌려줄 더미 교육 데이터 배열
  
  const dummyCourses = [
    { id: 1, title: '시니어 디지털 튜터 양성과정', provider: '서울시 50+ 재단', status: '수강중' },
    { id: 2, title: '바리스타 2급 실기 특강', provider: '내일배움센터', status: '수강대기' },
  ];

  // 기존의 숫자 1 대신, 더미 데이터의 개수를 가져와서 표시합니다.
  // const courseCount = dummyCourses.length; 

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

// 정보수정 버튼 클릭 시 호출
  const infosetting = () => {
    setIsEditModalOpen(true);
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
          </div>
        </div>

        {/* 관심교육 */}
        <button className="bookmark" 
        onClick={() => setIsModalOpen(true)}>관심교육</button>
             
        {/*  */}
        <div className="profile-info">
          {/* 내정보 수정 */}
          
          <div className="info-line">
            <span className="myinfo" onClick={infosetting}>
              정보수정</span>
          
            <span className="logout" 
              onClick={logout}>로그아웃</span>
          </div>
        </div>
       
      </div>

      {/* 🚨 4. 팝업(모달) 화면 영역 (isModalOpen이 true일 때만 화면에 나타남) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          {/* 모달 내부 클릭 시 닫히지 않도록 이벤트 전파(e.stopPropagation) 차단 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>관심 교육</h3>
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
      {/* 팝업2. 정보수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>내 정보 수정</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={24} color="#cbd5e1" />
              </button>
            </div>

            <form className="edit-form">
              <div className="input-group">
                <label> <User size={18} />이름</label>
                <input type="text" defaultValue={user?.name || '사용자'} />
              </div>
              <div className="input-group">
                <label> <Mail size={18} />이메일</label>
                <input type="email" defaultValue={user?.email || 'example@mail.com'} />
              </div>
              <div className="input-group">
                <label><Phone size={18} /> 연락처</label>
                <input type="text" placeholder="010-0000-0000" />
              </div>
              <div className="edit-actions">
                <button type="button" className="save-btn" onClick={()=>{
                  alert('정보가 저장되었습니다.');
                  setIsEditModalOpen(false);
                  }}>변경사항 저장</button>
                <button type="button" className="cancel-btn" onClick={()=>setIsEditModalOpen(false)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}