import React, { useState, useEffect } from 'react';
import { Search, Star, Loader2, PlayCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import './Contents.css';
import api from '../../api/api';

const Contents = () => {
  const [query, setQuery] = useState('중장년 재취업 교육');
  const [allVideos, setAllVideos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState('relevance');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [preferenceError, setPreferenceError] = useState('');
  const [selectedPreference, setSelectedPreference] = useState('전체');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const pagePerBlock = 10;

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  const fetchVideos = async (searchQuery, currentOrder) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setCurrentPage(1);

    try {
      let combinedItems = [];

      const searchUrl1 = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(
        searchQuery
      )}&type=video&order=${currentOrder}&key=${API_KEY}`;

      const searchRes1 = await fetch(searchUrl1);
      const searchData1 = await searchRes1.json();

      combinedItems = [...(searchData1.items || [])];

      if (searchData1.nextPageToken) {
        const searchUrl2 = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(
          searchQuery
        )}&type=video&order=${currentOrder}&pageToken=${searchData1.nextPageToken}&key=${API_KEY}`;

        const searchRes2 = await fetch(searchUrl2);
        const searchData2 = await searchRes2.json();

        combinedItems = [...combinedItems, ...(searchData2.items || [])];
      }

      const videoIds = combinedItems
        .map((item) => item.id?.videoId)
        .filter(Boolean);

      let finalVideosWithStats = [];

      for (let i = 0; i < videoIds.length; i += 50) {
        const chunkIds = videoIds.slice(i, i + 50).join(',');

        if (chunkIds) {
          const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${chunkIds}&key=${API_KEY}`;
          const statsRes = await fetch(statsUrl);
          const statsData = await statsRes.json();

          finalVideosWithStats = [
            ...finalVideosWithStats,
            ...(statsData.items || []),
          ];
        }
      }

      setAllVideos(finalVideosWithStats);
    } catch (error) {
      console.error('유튜브 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('worklinker_user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    setUser(parsedUser);

    const fetchPreferences = async () => {
      if (!parsedUser?.id) {
        setPreferenceError('로그인 정보가 없습니다.');
        fetchVideos('중장년 재취업 교육', order);
        return;
      }

      try {
        const res = await api.get(`/auth/user/${parsedUser.id}/preferences`);

        if (!res.data.ok) {
          throw new Error(res.data.error || '관심 직무 정보를 불러오지 못했습니다.');
        }

        const jobs = res.data.preferences || [];
        setPreferences(jobs);

        if (jobs.length > 0) {
          const firstQuery = `${jobs[0]} 교육`;
          setSelectedPreference(jobs[0]);
          setQuery(firstQuery);
          fetchVideos(firstQuery, order);
        } else {
          fetchVideos('중장년 재취업 교육', order);
        }
      } catch (err) {
        console.error('선호 직무 조회 실패:', err);
        setPreferenceError(
          err.response?.data?.error || err.message || '관심 직무 정보를 불러오지 못했습니다.'
        );
        fetchVideos('중장년 재취업 교육', order);
      }
    };

    fetchPreferences();
  }, []);

  useEffect(() => {
    if (selectedPreference === '전체') {
      if (preferences.length > 0) {
        const mergedQuery = `${preferences.join(' ')} 교육`;
        setQuery(mergedQuery);
        fetchVideos(mergedQuery, order);
      }
    } else {
      const nextQuery = `${selectedPreference} 교육`;
      setQuery(nextQuery);
      fetchVideos(nextQuery, order);
    }
  }, [order]);

  const handleSearch = () => {
    fetchVideos(query, order);
  };

  const handlePreferenceClick = (job) => {
    setSelectedPreference(job);

    const nextQuery =
      job === '전체'
        ? preferences.length > 0
          ? `${preferences.join(' ')} 교육`
          : '중장년 재취업 교육'
        : `${job} 교육`;

    setQuery(nextQuery);
    fetchVideos(nextQuery, order);
  };

  const indexOfLastVideo = currentPage * itemsPerPage;
  const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
  const currentVideos = allVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  const currentBlock = Math.ceil(currentPage / pagePerBlock);
  const startPage = (currentBlock - 1) * pagePerBlock + 1;
  let endPage = startPage + pagePerBlock - 1;
  if (endPage > totalPages) endPage = totalPages;

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevBlock = () => {
    if (startPage > 1) setCurrentPage(startPage - 1);
  };

  const handleNextBlock = () => {
    if (endPage < totalPages) setCurrentPage(endPage + 1);
  };

  const formatCount = (count) =>
    count ? parseInt(count, 10).toLocaleString() : '0';

  const formatDate = (dateString) =>
    dateString ? dateString.split('T')[0] : '';

  return (
    <div className="contents-container">
      <section className="video-search-section">
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="관심 있는 교육 내용을 검색해보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-submit-btn" onClick={handleSearch}>
            <Search size={24} color="#fff" />
          </button>
        </div>

        <div className="contents-user-box">
          <h3 className="contents-user-title">
            {user?.username ? `${user.username}님 맞춤 콘텐츠` : '맞춤 콘텐츠'}
          </h3>

          {preferences.length > 0 && (
            <div className="contents-preference-tags">
              <button
                type="button"
                className={`contents-pref-btn ${
                  selectedPreference === '전체' ? 'active' : ''
                }`}
                onClick={() => handlePreferenceClick('전체')}
              >
                전체
              </button>

              {preferences.map((job) => (
                <button
                  key={job}
                  type="button"
                  className={`contents-pref-btn ${
                    selectedPreference === job ? 'active' : ''
                  }`}
                  onClick={() => handlePreferenceClick(job)}
                >
                  {job}
                </button>
              ))}
            </div>
          )}

          {preferenceError && (
            <p className="contents-preference-error">{preferenceError}</p>
          )}
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
                    <div
                      className="video-thumbnail-box"
                      onClick={() => setSelectedVideo(video.id)}
                    >
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt="thumbnail"
                      />

                      <button
                        className="fav-star-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isFav) {
                            setFavorites(
                              favorites.filter((id) => id !== video.id)
                            );
                          } else {
                            setFavorites([...favorites, video.id]);
                          }
                        }}
                      >
                        <Star
                          size={24}
                          color={isFav ? '#fbbf24' : '#fff'}
                          fill={isFav ? '#fbbf24' : 'none'}
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

            {totalPages > 0 && (
              <div className="pagination-container">
                <button
                  onClick={handlePrevBlock}
                  disabled={startPage === 1}
                  className="nav-arrow"
                >
                  &lt; 이전
                </button>

                <div className="page-nums">
                  {pageNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`num-btn ${currentPage === num ? 'active' : ''}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextBlock}
                  disabled={endPage === totalPages}
                  className="nav-arrow"
                >
                  다음 &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="video-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-x"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={32} color="#fff" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contents;