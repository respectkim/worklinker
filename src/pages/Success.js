import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Success.css';
import CommonHeader from '../components/CommonHeader';

const SUCCESS_POSTS = [
  {
    id: 1,
    title: '58세에 요양보호사로 다시 일하게 되었어요',
    author: '김OO',
    ageGroup: '55~59세',
    category: '돌봄·복지',
    job: '요양보호사',
    period: '3개월',
    summary:
      '국비지원 교육 수료 후 요양기관 취업에 성공한 사례입니다. 경력 공백이 있었지만 자격 취득과 면접 준비를 통해 재취업에 성공했습니다.',
    createdAt: '2026-03-31',
    views: 128,
    featured: true,
  },
  {
    id: 2,
    title: '사무보조 직무로 재취업에 성공했습니다',
    author: '박OO',
    ageGroup: '50~54세',
    category: '사무·행정',
    job: '사무보조',
    period: '2개월',
    summary:
      '엑셀과 문서작성 교육 이후 중소기업 사무직으로 취업했습니다. 처음엔 자신감이 부족했지만 실습 중심 교육이 큰 도움이 됐습니다.',
    createdAt: '2026-03-29',
    views: 84,
    featured: false,
  },
  {
    id: 3,
    title: '물류 현장 경험을 살려 관리직으로 옮겼어요',
    author: '이OO',
    ageGroup: '60~64세',
    category: '물류·유통',
    job: '물류관리',
    period: '4개월',
    summary:
      '기존 현장 경험을 바탕으로 물류관리 교육을 수강한 뒤 관리 업무로 재취업한 사례입니다.',
    createdAt: '2026-03-27',
    views: 96,
    featured: true,
  },
  {
    id: 4,
    title: '매장판매직으로 다시 시작했어요',
    author: '최OO',
    ageGroup: '45~49세',
    category: '서비스',
    job: '매장판매직',
    period: '1개월',
    summary:
      '서비스 교육과 면접 코칭 후 근거리 매장에 취업했습니다. 근무시간과 생활 리듬을 맞추기 쉬워 만족도가 높았습니다.',
    createdAt: '2026-03-25',
    views: 67,
    featured: false,
  },
  {
    id: 5,
    title: '경비 직무 자격 준비 후 빠르게 취업했어요',
    author: '정OO',
    ageGroup: '55~59세',
    category: '시설·안전',
    job: '경비원',
    period: '2개월',
    summary:
      '필수 교육 이수와 자격 준비를 병행한 뒤 아파트 시설 경비직으로 재취업했습니다.',
    createdAt: '2026-03-22',
    views: 111,
    featured: false,
  },
  {
    id: 6,
    title: '디지털 기초교육 덕분에 사무직 문턱이 낮아졌어요',
    author: '한OO',
    ageGroup: '50~54세',
    category: '디지털·사무',
    job: '문서관리',
    period: '3개월',
    summary:
      '컴퓨터 활용이 익숙하지 않았지만 기초부터 다시 배우면서 자신감을 회복했고, 문서관리 직무로 연결됐습니다.',
    createdAt: '2026-03-20',
    views: 74,
    featured: true,
  },
];

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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredPosts = useMemo(() => {
    return SUCCESS_POSTS.filter((post) => {
      const matchCategory =
        selectedCategory === '전체' || post.category === selectedCategory;

      const keyword = searchKeyword.trim().toLowerCase();
      const matchKeyword =
        keyword === '' ||
        post.title.toLowerCase().includes(keyword) ||
        post.summary.toLowerCase().includes(keyword) ||
        post.job.toLowerCase().includes(keyword) ||
        post.ageGroup.toLowerCase().includes(keyword);

      return matchCategory && matchKeyword;
    });
  }, [searchKeyword, selectedCategory]);

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
                  placeholder="직무명, 연령대, 키워드로 검색"
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

          {filteredPosts.length === 0 ? (
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
                      <span className="success-badge age">{post.ageGroup}</span>
                      <span className="success-badge category">
                        {post.category}
                      </span>
                    </div>

                    <span className="success-views">조회 {post.views}</span>
                  </div>

                  <h6 className="success-card-title">{post.title}</h6>

                  <div className="success-meta">
                    <span>{post.author}</span>
                    <span>{post.job}</span>
                    <span>취업까지 {post.period}</span>
                  </div>

                  <p className="success-summary">{post.summary}</p>

                  <div className="success-card-bottom">
                    <span className="success-date">{post.createdAt}</span>
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