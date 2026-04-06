import React, { useState, useEffect } from 'react';
import { Search, Star, Loader2, PlayCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import './Contents.css';

const Contents = () => {
  const [query, setQuery] = useState('중장년 재취업 교육');
  const [allVideos, setAllVideos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState('relevance');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 페이지네이션 관련
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const pagePerBlock = 10;

  const fetchVideos = async (searchQuery, currentOrder) => {
    setIsLoading(true);
    setCurrentPage(1);
    try{
      let combinedItems = [];

      // 첫 페이지 검색
      const searchUrl1 = `http://13.124.46.84:3001/api/youtube/search?q=${encodeURIComponent(searchQuery)}&order=${currentOrder}`;
      const searchRes1 = await fetch(searchUrl1);
      const searchData1 = await searchRes1.json();
      combinedItems = [...(searchData1.items || [])];

      // 다음 페이지가 있다면 추가 검색
      if (searchData1.nextPageToken){
        const searchUrl2 = `http://13.124.46.84:3001/api/youtube/search?q=${encodeURIComponent(searchQuery)}&order=${currentOrder}&pageToken=${searchData1.nextPageToken}`;
        const searchRes2 = await fetch(searchUrl2);
        const searchData2 = await searchRes2.json();
        combinedItems = [...combinedItems, ...(searchData2.items || [])];
      }

      const videoIds = combinedItems.map(item => item.id.videoId).filter(Boolean);
      let finalVideosWithStats = [];

      // 50개씩 쪼개서 조회수 통계 가져오기
      for (let i =0; i < videoIds.length; i +=50) {
        const chunkIds = videoIds.slice(i, i+50).join(',');
        if(chunkIds){
          const statsUrl = `http://13.124.46.84:3001/api/youtube/videos?id=${chunkIds}`;
          const statsRes = await fetch(statsUrl);
          const statsData = await statsRes.json();
          finalVideosWithStats = [...finalVideosWithStats, ...(statsData.items || [])];
        }
      }
      setAllVideos(finalVideosWithStats);
    } catch (error){
      console.error('유튜브 데이터 로드 실패', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchVideos(query, order); }, [order]);
  const handleSearch = () => fetchVideos(query, order);

  const indexOfLastVideo = currentPage * itemsPerPage;
  const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
  const currentVideos = allVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  const currentBlock = Math.ceil(currentPage / pagePerBlock);
  const startPage = (currentBlock - 1) * pagePerBlock + 1;
  let endPage = startPage + pagePerBlock - 1;
  if (endPage > totalPages) endPage = totalPages;

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) { pageNumbers.push(i); }

  const handlePrevBlock = () => { if (startPage > 1) setCurrentPage(startPage - 1); };
  const handleNextBlock = () => { if (endPage < totalPages) setCurrentPage(endPage + 1); };

  const formatCount = (count) => count ? parseInt(count).toLocaleString() : '0';
  const formatDate = (dateString) => dateString ? dateString.split('T')[0] : '';

  return (
    <div className="contents-container">
      {/* 검색 영역 */}
      <section className="video-search-section">
        <div className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder="관심 있는 교육 내용을 검색해보세요" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
          />
          <button className="search-submit-btn" onClick={handleSearch}>
            <Search size={24} color="#fff" />
          </button>
        </div>
      </section>

      <main className="contents-main">
        {isLoading ? (
          <div className="loader-container">
            <Loader2 className="spinner" size={48} color="#2563eb" />
          </div>
        ) : (
          <>
            <div className="contents-header-row">
              <h2 className="contents-main-title">추천 교육 콘텐츠</h2>
              <select 
                value={order} 
                onChange={(e) => setOrder(e.target.value)} 
                className="sort-dropdown"
              >
                <option value="relevance">관련도순</option>
                <option value="date">최신순</option>
                <option value="viewCount">인기순</option>
              </select>
            </div>

            <div className="contents-grid">
              {currentVideos.map((video) => {
                const isFav = favorites.includes(video.id);
                return (
                  <motion.div 
                    whileHover={{ y: -10 }} 
                    className="content-card" 
                    key={video.id}
                  >
                    <div className="video-thumbnail-box" onClick={() => setSelectedVideo(video.id)}>
                      <img src={video.snippet.thumbnails.medium.url} alt="thumbnail" />
                      <button 
                        className="fav-star-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFav) {
                            setFavorites(favorites.filter(id => id !== video.id));
                          } else {
                            setFavorites([...favorites, video.id]);
                          }
                        }}
                      >
                        <Star 
                          size={24} 
                          color={isFav ? "#fbbf24" : "#fff"} 
                          fill={isFav ? "#fbbf24" : "none"} 
                        />
                      </button>
                      <div className="play-icon-overlay">
                        <PlayCircle size={50} color="#fff" />
                      </div>
                    </div>

                    <div className="video-info-box">
                      <h3 className="video-title">{video.snippet.title}</h3>
                      <p className="channel-name">{video.snippet.channelTitle}</p>
                      <div className="video-meta">
                        <span>👁️ {formatCount(video.statistics?.viewCount)}회</span>
                        <span>📅 {formatDate(video.snippet.publishedAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 0 && (
              <div className="pagination-container">
                <button onClick={handlePrevBlock} disabled={startPage === 1} className="nav-arrow">
                  &lt; 이전
                </button>
                <div className="page-nums">
                  {pageNumbers.map(num => (
                    <button 
                      key={num} 
                      onClick={() => setCurrentPage(num)}
                      className={`num-btn ${currentPage === num ? 'active' : ''}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button onClick={handleNextBlock} disabled={endPage === totalPages} className="nav-arrow">
                  다음 &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 모달 */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => setSelectedVideo(null)}>
              <X size={32} color="#fff" />
            </button>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0" allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contents;