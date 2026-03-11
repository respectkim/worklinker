// pages/Postboard.js
import { useEffect, useState } from "react";
import api from "../api/api";
import "./Postboard.css";

function Postboard({ mileage, setMileage }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

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
    if (!newPost.trim()) return;

    try {
      const res = await api.post("/posts", { content: newPost });

      // 최신 글 위로
      setPosts(prev => [res.data.post, ...prev]);

      // 마일리지 +1
      if (setMileage) setMileage(res.data.mileage);

      setNewPost("");
    } catch (err) {
      alert("게시글 작성 실패");
    }
  };

  // 게시글 삭제
  const deletePost = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await api.delete(`/posts/${id}`);

      setPosts(prev => prev.filter(post => post.id !== id));

      // 마일리지 -1
      if (setMileage) setMileage(res.data.mileage);
    } catch (err) {
      alert("게시글 삭제 실패");
    }
  };

  return (
    <div className="page">
      <div className="postboard-container">
        <h2 className="member">💬 커뮤니티</h2>

        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="게시글 작성"
        />
        <button onClick={createPost}>등록</button>

        {posts.map(post => (
          <div key={post.id} className="post-card">
            <p>{post.content}</p>
            <button onClick={() => deletePost(post.id)}>삭제</button>

            {/* 🔕 댓글 기능은 백엔드 준비 후 활성화 */}
            {/* 
            {post.comments?.map(c => (
              <div key={c.id} className="comment">
                {c.content}
              </div>
            ))}

            <CommentInput onSubmit={text => addComment(post.id, text)} />
            */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Postboard;