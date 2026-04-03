
import { Link, useParams } from 'react-router-dom';
import './SuccessDetail.css';
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
    createdAt: '2026-03-31',
    views: 128,
    featured: true,
    content:
      '처음에는 다시 취업할 수 있을지 자신이 없었습니다. 하지만 국비지원 교육을 통해 자격 취득 과정을 체계적으로 준비할 수 있었고, 실습과 면접 대비까지 하면서 점점 자신감을 얻었습니다. 교육 수료 후 요양기관 채용 공고를 꾸준히 확인했고, 지원한 기관에서 좋은 결과를 얻어 재취업에 성공했습니다.',
  },
  {
    id: 2,
    title: '사무보조 직무로 재취업에 성공했습니다',
    author: '박OO',
    ageGroup: '50~54세',
    category: '사무·행정',
    job: '사무보조',
    period: '2개월',
    createdAt: '2026-03-29',
    views: 84,
    featured: false,
    content:
      '문서작성과 엑셀 업무가 낯설었지만, 기초 교육을 차근차근 따라가면서 업무 이해도가 높아졌습니다. 이후 이력서를 다시 정리하고 면접 코칭을 받으며 자신감을 키웠고, 중소기업 사무보조로 재취업할 수 있었습니다.',
  },
  {
    id: 3,
    title: '물류 현장 경험을 살려 관리직으로 옮겼어요',
    author: '이OO',
    ageGroup: '60~64세',
    category: '물류·유통',
    job: '물류관리',
    period: '4개월',
    createdAt: '2026-03-27',
    views: 96,
    featured: true,
    content:
      '기존 현장 경험이 있었기 때문에 물류 흐름은 익숙했지만, 관리 업무는 처음이었습니다. 교육 과정에서 재고 관리, 문서 처리, 시스템 사용법을 배우며 업무 범위를 넓혔고, 결국 물류관리 직무로 취업하게 되었습니다.',
  },
];

export default function SuccessDetail() {
  const { id } = useParams();
  const post = SUCCESS_POSTS.find((item) => String(item.id) === String(id));

  if (!post) {
    return (
      <div className="success-detail-layout">
        <CommonHeader />
        <div className="success-detail-page">
          <div className="success-detail-empty">
            <h2>게시글을 찾을 수 없습니다.</h2>
            <p>존재하지 않거나 삭제된 성공사례입니다.</p>
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
              <span className="success-detail-badge age">{post.ageGroup}</span>
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
            <span>작성자 {post.author}</span>
            <span>직무 {post.job}</span>
            <span>취업까지 {post.period}</span>
            <span>작성일 {post.createdAt}</span>
            <span>조회 {post.views}</span>
          </div>

          <div className="success-detail-content">
            <p>{post.content}</p>
          </div>

          <div className="success-detail-bottom">
            <Link to="/success" className="success-back-btn">
              목록으로 돌아가기
            </Link>
            <Link to="/success/write" className="success-write-link">
              글쓰기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
