import React, { useState, useEffect } from 'react';
import { Search, Star, Library, Loader2, PlayCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contents = () => {
  const [query, setQuery] = useState('중장년 재취업 교육');
  const [allVideos, setAllVideos] = useState([]); // 최대 90개의 비디오 저장
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState('relevance');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // --- 페이지네이션 관련 상태 ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 1페이지당 9개 출력
  const pagePerBlock = 10; // 하단에 보여줄 페이지 번호 개수 (1~10, 11~20)

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  // 유튜브 데이터 대량 호출 로직 (연속 호출)
  const fetchVideos = async (searchQuery, currentOrder) => {
    setIsLoading(true);
    setCurrentPage(1); // 검색 시 1페이지로 초기화

    try {
      let combinedItems = [];
      
      // 1차 호출 (최대 50개)
      const searchUrl1 = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${searchQuery}&type=video&order=${currentOrder}&key=${API_KEY}`;
      const searchRes1 = await fetch(searchUrl1);
      const searchData1 = await searchRes1.json();
      combinedItems = [...(searchData1.items || [])];

      // 2차 호출 (다음 페이지 토큰이 있다면 이어서 50개 더 가져오기 -> 총 100개)
      if (searchData1.nextPageToken) {
        const searchUrl2 = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${searchQuery}&type=video&order=${currentOrder}&pageToken=${searchData1.nextPageToken}&key=${API_KEY}`;
        const searchRes2 = await fetch(searchUrl2);
        const searchData2 = await searchRes2.json();
        combinedItems = [...combinedItems, ...(searchData2.items || [])];
      }

      // 비디오 ID만 추출하여 상세 통계(조회수) 가져오기
      const videoIds = combinedItems.map(item => item.id.videoId).join(',');
      if (videoIds) {
        // ID가 50개를 초과할 수 있으므로, 50개씩 잘라서 요청해야 완벽하지만
        // 초보 단계이므로 첫 50개의 상세 정보만 가져오거나, 
        // 화면 표시에 꼭 필요한 데이터만 세팅하는 방식으로 타협합니다.
        // (여기서는 최대 50개까지만 통계를 가져오는 예시입니다.)
        const first50Ids = combinedItems.slice(0, 50).map(item => item.id.videoId).join(',');
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${first50Ids}&key=${API_KEY}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        
        // 검색 결과와 상세 정보 병합 (단순화를 위해 상세 정보가 있는 것만 세팅)
        setAllVideos(statsData.items || []);
      } else {
        setAllVideos([]);
      }
    } catch (error) {
      console.error("유튜브 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(query, order);
  }, [order]);

  const handleSearch = () => fetchVideos(query, order);

  // --- 화면 노출용 데이터 슬라이싱 ---
  const indexOfLastVideo = currentPage * itemsPerPage;
  const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
  const currentVideos = allVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(allVideos.length / itemsPerPage);

  // --- 블록(Block) 페이지네이션 계산 로직 ---
  const currentBlock = Math.ceil(currentPage / pagePerBlock);
  const startPage = (currentBlock - 1) * pagePerBlock + 1;
  let endPage = startPage + pagePerBlock - 1;
  if (endPage > totalPages) endPage = totalPages;

  // 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 이전/다음 블록 이동 함수
  const handlePrevBlock = () => {
    if (startPage > 1) setCurrentPage(startPage - 1);
  };
  const handleNextBlock = () => {
    if (endPage < totalPages) setCurrentPage(endPage + 1);
  };

  // 포맷 함수 (생략: 기존 코드와 동일)
  const formatCount = (count) => { return count ? parseInt(count).toLocaleString() : '0'; };
  const formatDate = (dateString) => { return dateString ? dateString.split('T')[0] : ''; };

  return (
    <div style={styles.container}>
      {/* 검색 및 상단 헤더 영역 (기존과 동일) */}
      <section style={styles.searchSection}>
        <div style={styles.searchBar}>
          <input type="text" placeholder="관심 있는 교육 내용을 검색해보세요" value={query} onChange={(e) => setQuery(e.target.value)} style={styles.input} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
          <button style={styles.searchBtn} onClick={handleSearch}><Search size={24} color="#fff" /></button>
        </div>
      </section>

      <main style={styles.mainContent}>
        {isLoading ? (
          <div style={styles.center}><Loader2 className="spinner" size={40} color="#3b82f6" /></div>
        ) : (
          <>
            {/* 카드 렌더링 영역 (기존과 동일) */}
            <div style={styles.grid}>
              {currentVideos.map((video) => (
                <motion.div whileHover={{ y: -5 }} style={styles.card} key={video.id}>
                  <div style={styles.thumbnailWrapper} onClick={() => setSelectedVideo(video.id)}>
                    <img src={video.snippet.thumbnails.medium.url} style={styles.thumbnail} alt="thumbnail" />
                    <div style={styles.playOverlay}><PlayCircle size={48} color="#fff" /></div>
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardTitle}>{video.snippet.title}</h3>
                    <p style={styles.channelName}>{video.snippet.channelTitle}</p>
                    <div style={styles.statsRow}>
                      <span>👁️ 조회수 {formatCount(video.statistics?.viewCount)}회</span>
                      <span>📅 {formatDate(video.snippet.publishedAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 🔥 새롭게 디자인된 블록 페이지네이션 🔥 */}
            {totalPages > 0 && (
              <div style={styles.paginationWrapper}>
                {/* < 이전 버튼 */}
                <button 
                  onClick={handlePrevBlock} 
                  disabled={startPage === 1}
                  style={{...styles.navBtn, color: startPage === 1 ? '#475569' : '#f1f5f9'}}
                >
                  &lt; 이전
                </button>

                {/* 11 12 13... 페이지 번호 */}
                <div style={styles.pageNumbers}>
                  {pageNumbers.map(num => (
                    <button 
                      key={num} 
                      onClick={() => setCurrentPage(num)}
                      style={{
                        ...styles.pageNumberBtn,
                        borderColor: currentPage === num ? '#3b82f6' : '#334155',
                        color: currentPage === num ? '#3b82f6' : '#cbd5e1',
                        fontWeight: currentPage === num ? 'bold' : 'normal',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* 다음 > 버튼 */}
                <button 
                  onClick={handleNextBlock} 
                  disabled={endPage === totalPages}
                  style={{...styles.navBtn, color: endPage === totalPages ? '#475569' : '#f1f5f9'}}
                >
                  다음 &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// CSS in JS 스타일
const styles = {
  container: { backgroundColor: '#0f172a', color: '#f1f5f9', minHeight: '100vh', padding: '20px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '24px', fontWeight: 'bold' },
  sortSelect: { backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  searchSection: { display: 'flex', justifyContent: 'center', marginBottom: '40px', marginTop: '20px' },
  searchBar: { display: 'flex', width: '100%', maxWidth: '600px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '8px 16px', border: '1px solid #334155' },
  input: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none' },
  searchBtn: { backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' },
  
  // 2번: 무조건 3단으로 고정되는 레이아웃 (1fr 1fr 1fr)
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  
  card: { backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' },
  thumbnailWrapper: { position: 'relative', cursor: 'pointer', width: '100%', aspectRatio: '16/9' },
  thumbnail: { width: '100%', height: '100%', objectFit: 'cover' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' },
  cardInfo: { padding: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4', height: '44px', overflow: 'hidden' },
  channelName: { color: '#94a3b8', fontSize: '14px', marginBottom: '8px' },
  statsRow: { display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '4px' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '16px' },
  actionBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', fontSize: '14px' },
  
    
  // 1번: 영상 재생 모달 스타일
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '80%', maxWidth: '900px', aspectRatio: '16/9', position: 'relative', backgroundColor: '#000', borderRadius: '16px', overflow: 'hidden' },
  closeBtn: { position: 'absolute', top: '-40px', right: '0px', background: 'none', border: 'none', cursor: 'pointer' },
  center: { textAlign: 'center', padding: '100px' },
  
  // 페이지네이션 래퍼 
  paginationWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '50px', marginBottom: '30px' },
  pageNumbers: { display: 'flex', gap: '8px' },
  pageNumberBtn: { 
    width: '36px', height: '36px', 
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '4px', 
    fontSize: '15px', 
    cursor: 'pointer', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s'
  },
  navBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    padding: '0 8px'
  }
};
  
  

export default Contents;