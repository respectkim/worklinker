import { useMemo, useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Success.css';
import CommonHeader from '../components/CommonHeader';


const CATEGORY_OPTIONS = [
  '전체',
  '사무·행정',
  '돌봄·복지',
  '물류·유통',
  '서비스',
  '시설·안전',
  '디지털·사무',
];

export default function Success() {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('http://127.0.0.1:5000/api/success/');
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || '성공사례 목록을 불러오지 못했습니다.');
        }

        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        setError(err.message || '서버 연결 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        selectedCategory === '전체' || post.category === selectedCategory;

      const keyword = searchKeyword.trim().toLowerCase();

      const matchKeyword =
        keyword === '' ||
        (post.title || '').toLowerCase().includes(keyword) ||
        (post.summary || '').toLowerCase().includes(keyword) ||
        (post.job || '').toLowerCase().includes(keyword) ||
        (post.username || '').toLowerCase().includes(keyword);

      return matchCategory && matchKeyword;
    });
  }, [posts, searchKeyword, selectedCategory]);

  return (
    <div className="success-layout">
      <CommonHeader />

      <div className="success-page">
        <section className="success-hero">
          <div className="success-hero-inner">
            <div className="success-heading">
              <span className="success-label">SUCCESS STORY</span>
              <h1 className="success-title">성공사례</h1>
              <p className="success-subtitle">
                재취업에 성공한 분들의 실제 경험을 확인해보세요.
                <br />
                직무 선택부터 교육, 취업까지의 과정을 한눈에 볼 수 있습니다.
              </p>
            </div>

            <div className="success-actions">
              <div className="success-search-box">
                <input
                  type="text"
                  placeholder="직무명, 작성자, 키워드로 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="success-filter-box">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <Link to="/success/write" className="success-write-btn">
                글쓰기
              </Link>
            </div>
          </div>
        </section>

        <section className="success-list-section">
          <div className="success-list-top">
            <h2 className="success-list-title">
              전체 사례 <span>{filteredPosts.length}</span>
            </h2>
            <p className="success-list-guide">
              실제 취업 경험을 바탕으로 정리된 게시글입니다.
            </p>
          </div>

          {loading ? (
            <div className="success-empty">
              <strong>불러오는 중입니다.</strong>
              <p>성공사례 목록을 가져오고 있어요.</p>
            </div>
          ) : error ? (
            <div className="success-empty">
              <strong>목록을 불러오지 못했습니다.</strong>
              <p>{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="success-empty">
              <strong>검색 결과가 없습니다.</strong>
              <p>검색어 또는 카테고리를 다시 조정해보세요.</p>
            </div>
          ) : (
            <div className="success-grid">
              {filteredPosts.map((post) => (
                <article className="success-card" key={post.id}>
                  <div className="success-card-top">
                    <div className="success-badges">
                      {post.featured && (
                        <span className="success-badge featured">추천</span>
                      )}
                      <span className="success-badge category">
                        {post.category}
                      </span>
                    </div>

                    <span className="success-views">
                      조회 {post.views ?? 0}
                    </span>
                  </div>

                  <h6 className="success-card-title">{post.title}</h6>

                  <div className="success-meta">
                    <span>{post.username || '작성자 미상'}</span>
                    <span>{post.job || '-'}</span>
                    <span>취업까지 {post.period || '-'}</span>
                  </div>

                  <p className="success-summary">
                    {post.summary || '요약이 아직 등록되지 않았습니다.'}
                  </p>

                  <div className="success-card-bottom">
                    <span className="success-date">
                      {post.created_at
                        ? String(post.created_at).slice(0, 10)
                        : '-'}
                    </span>

                    <Link
                      to={`/success/${post.id}`}
                      className="success-detail-link"
                    >
                      자세히 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}