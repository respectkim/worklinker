// pages/Postboard.js
import { useEffect, useState } from "react";
import api from "../api/api";
import "./Postboard.css";

function Postboard() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const res = await api.post("/posts", { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (err) {
      alert("게시글 작성 실패");
    }
  };

  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: text
      });

      setPosts(
        posts.map(p =>
          p.id === postId
            ? { ...p, comments: [...p.comments, res.data] }
            : p
        )
      );
    } catch (err) {
      alert("댓글 작성 실패");
    }
  };

  return (
    <div className="page">
      <div className="postboard-container">
        <h2 className="member">커뮤니티</h2>

        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="게시글 작성"
        />
        <button onClick={createPost}>등록</button>

        {posts.map(post => (
          <div key={post.id} className="post-card">
            <p>{post.content}</p>

            {post.comments?.map(c => (
              <div key={c.id} className="comment">
                {c.content}
              </div>
            ))}

            <CommentInput onSubmit={text => addComment(post.id, text)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentInput({ onSubmit }) {
  const [text, setText] = useState("");

  return (
    <div className="comment-input">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="댓글"
      />
      <button
        onClick={() => {
          onSubmit(text);
          setText("");
        }}
      >
        등록
      </button>
    </div>
  );
}

export default Postboard;


