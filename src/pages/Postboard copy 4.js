// pages/Postboard.js
import { useEffect, useState } from "react";
import api from "../api/api";
import "./Postboard.css";

function Postboard({ mileage, setMileage }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("게시글 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 게시글 작성
  const createPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 서버 요청 시 title과 content 모두 전달
      const res = await api.post("/posts", { title, content });

      // 서버에서 post 객체와 mileage를 반환
      const newPost = res.data?.post;
      if (!newPost) {
        alert(res.data?.message || "게시글 작성 실패: 서버 반환값 확인 필요");
        return;
      }

      // 최신 글 위로
      setPosts(prev => [newPost, ...prev]);

      // 마일리지 +1
      if (setMileage) setMileage(res.data.mileage);

      // 입력 초기화
      setTitle("");
      setContent("");
    } catch (err) {
      alert(err.response?.data?.message || "게시글 작성 실패");
    }
  };

  // 게시글 삭제
  // const deletePost = async (id) => {
  //   if (!window.confirm("정말 삭제하시겠습니까?")) return;

  //   try {
  //     const res = await api.delete(`/posts/${id}`);

  //     setPosts(prev => prev.filter(post => post.id !== id));

  //     // 마일리지 -1
  //     if (setMileage) setMileage(res.data.mileage);
  //   } catch (err) {
  //     alert("게시글 삭제 실패");
  //   }
  // };

  const deletePost = async (id) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
    const res = await api.delete(`/posts/${Number(id)}`); // <- Number() 추가
    setPosts(prev => prev.filter(post => post.id !== Number(id))); // <- 숫자로 비교
    if (setMileage) setMileage(res.data.mileage);
    } catch (err) {
    alert("게시글 삭제 실패");
   }
  };

  return (
    <div className="page">
      <div className="postboard-container">
        <h2 className="member">💬 커뮤니티</h2>

        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="post-title-input"
        />

        {/* 내용 입력 */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="게시글 내용을 입력하세요"
        />
        <button onClick={createPost}>등록</button>

        {/* 작성된 게시글 */}
        <div className="post-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              {/* 안전하게 title 출력 */}
              <h4 className="post-card-title">{post.title || "(제목 없음)"}</h4>
              <p>{post.content}</p>
              <button onClick={() => deletePost(post.id)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Postboard;