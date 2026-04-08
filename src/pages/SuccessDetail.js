
import { Link, useParams, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SuccessDetail.css';
import CommonHeader from '../components/CommonHeader';

export default function SuccessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [error, setError] = useState('');

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`http://127.0.0.1:5000/api/success/${id}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || '상세 정보를 불러오지 못했습니다.');
      }

      setPost(data.post || null);
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      setError(err.message || '서버 연결 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const trimmed = commentText.trim();

    if (!trimmed) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setCommentLoading(true);

      const res = await fetch(`http://127.0.0.1:5000/api/success/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          content: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || '댓글 등록에 실패했습니다.');
      }

      setCommentText('');
      await fetchPostDetail();
    } catch (err) {
      console.error(err);
      alert(err.message || '댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('정말 이 게시글을 삭제할까요?');
    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(`http://127.0.0.1:5000/api/success/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || '게시글 삭제에 실패했습니다.');
      }

      alert('게시글이 삭제되었습니다.');
      navigate('/success');
    } catch (err) {
      console.error(err);
      alert(err.message || '삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm('정말 이 댓글을 삭제할까요?');
    if (!confirmed) return;

    try {
      setDeletingCommentId(commentId);

      const res = await fetch(
        `http://127.0.0.1:5000/api/success/${id}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || '댓글 삭제에 실패했습니다.');
      }

      alert('댓글이 삭제되었습니다.');
      await fetchPostDetail();
    } catch (err) {
      console.error(err);
      alert(err.message || '댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return (
      <div className="success-detail-layout">
        <CommonHeader />
        <div className="success-detail-page">
          <div className="success-detail-empty">
            <h2>불러오는 중입니다.</h2>
            <p>성공사례 상세 정보를 가져오고 있어요.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="success-detail-layout">
        <CommonHeader />
        <div className="success-detail-page">
          <div className="success-detail-empty">
            <h2>게시글을 찾을 수 없습니다.</h2>
            <p>{error || '존재하지 않거나 삭제된 성공사례입니다.'}</p>
            <Link to="/success" className="success-back-btn">
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-detail-layout">
      <CommonHeader />

      <div className="success-detail-page">
        <div className="success-detail-container">
          <div className="success-detail-top">
            <div className="success-detail-badges">
              {post.featured && (
                <span className="success-detail-badge featured">추천</span>
              )}
              <span className="success-detail-badge category">
                {post.category}
              </span>
            </div>

            <Link to="/success" className="success-back-link">
              ← 목록으로
            </Link>
          </div>

          <h5 className="success-detail-title">{post.title}</h5>

          <div className="success-detail-meta">
            <span>작성자 {post.username || '작성자 미상'}</span>
            <span>직무 {post.job || '-'}</span>
            <span>취업까지 {post.period || '-'}</span>
            <span>
              작성일 {post.created_at ? String(post.created_at).slice(0, 10) : '-'}
            </span>
            <span>조회 {post.views ?? 0}</span>
          </div>

          {post.summary && (
            <div className="success-detail-summary">
              <strong>한 줄 요약</strong>
              <p>{post.summary}</p>
            </div>
          )}

          <div className="success-detail-content">
            <p>{post.content}</p>
          </div>

          <div className="success-detail-comments">
            <h3>댓글</h3>

            {comments.length === 0 ? (
              <p className="success-comment-empty">아직 댓글이 없습니다.</p>
            ) : (
              <div className="success-comment-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="success-comment-item">
                    <div className="success-comment-meta">
                      <div className="success-comment-meta-left">
                        <strong>{comment.username || '익명'}</strong>
                        <span>
                          {comment.created_at
                            ? String(comment.created_at).slice(0, 16)
                            : ''}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="success-comment-delete-btn"
                        onClick={() => handleCommentDelete(comment.id)}
                        disabled={deletingCommentId === comment.id}
                      >
                        {deletingCommentId === comment.id ? '삭제 중...' : '댓글 삭제'}
                      </button>
                    </div>

                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            <form className="success-comment-form" onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="댓글을 입력하세요"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
              />
              <button type="submit" disabled={commentLoading}>
                {commentLoading ? '등록 중...' : '댓글 등록'}
              </button>
            </form>
          </div>

          <div className="success-detail-bottom">
            <Link to="/success" className="success-back-btn">
              목록으로 돌아가기
            </Link>

            <div className="success-detail-actions">
              <Link to="/success/write" className="success-write-link">
                글쓰기
              </Link>

              <button
                type="button"
                className="success-delete-btn"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? '삭제 중...' : '삭제하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}