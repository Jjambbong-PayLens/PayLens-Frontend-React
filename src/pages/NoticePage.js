import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NoticeModal from './NoticeModal';
import { getNotices } from '../utils/documentApi'; // 방금 추가하신 api 함수

const categoryMap = {
  all: '전체',
  NOTICE: '일반공지',
  EVENT: '이벤트',
  UPDATE: '업데이트'
};

function NoticePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(true); 
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 20;

  // 🚀 GET API 연동 함수 (완벽하게 정리됨)
  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // apiFetch가 내부적으로 에러 처리와 result 추출을 모두 해줍니다!
      const result = await getNotices();
      
      // 결과값이 배열인지 확인 후 내림차순 정렬하여 저장
      if (Array.isArray(result)) {
        const sortedNotices = result.sort((a, b) => b.noticeId - a.noticeId);
        setNotices(sortedNotices);
      } else {
        setNotices([]);
      }

    } catch (err) {
      console.error('공지사항 조회 실패:', err);
      setError(err.message || '공지사항 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = activeCategory === 'all' 
    ? notices 
    : notices.filter(notice => notice.category === activeCategory);

  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentNoticeItems = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleRowClick = (noticeId) => {
    navigate(`/notice/${noticeId}`);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchNotices(); // 작성 완료 시 목록 새로고침
  };

  return (
    <div className="notice-page-container">
      <header className="notice-header">
        <div className="header-title-area">
          <h1>{t('NoticePage_header_title', '공지사항')}</h1>
          <p>{t('NoticePage_header_subtitle', 'PayLens의 최신 업데이트 및 주요 소식을 전해드립니다.')}</p>
        </div>
        
        {isAdmin && (
          <div className="admin-actions">
            <button className="write-notice-btn" onClick={() => setIsModalOpen(true)}>
              + 공지사항 작성
            </button>
          </div>
        )}
      </header>

      <div className="category-tabs">
        {['all', 'NOTICE', 'EVENT', 'UPDATE'].map(cat => (
          <button 
            key={cat}
            className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`} 
            onClick={() => handleCategoryChange(cat)}
          >
            {categoryMap[cat]}
          </button>
        ))}
      </div>

      <section className="notice-board">
        <div className="notice-board-header">
          <span className="col-id">NO</span>
          <span className="col-category">분류</span>
          <span className="col-title">제목</span>
          <span className="col-date">등록일</span>
        </div>

        <div className="notice-board-body">
          {isLoading ? (
            <div className="empty-state">
              <p>공지사항을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p style={{ color: 'red' }}>{error}</p>
            </div>
          ) : currentNoticeItems.length > 0 ? (
            currentNoticeItems.map((notice) => (
              <div 
                key={notice.noticeId} 
                className="notice-row" 
                onClick={() => handleRowClick(notice.noticeId)}
              >
                <span className="col-id">{notice.noticeId}</span>
                <span className="col-category">
                  <span className={`badge ${notice.category.toLowerCase()}`}>{categoryMap[notice.category]}</span>
                </span>
                <span className="col-title">{notice.title}</span>
                <span className="col-date">{formatDate(notice.createdAt)}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>등록된 공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {totalPages > 0 && !isLoading && (
        <div className="pagination-container">
          <button 
            className="page-arrow-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            &lt;&lt;
          </button>
          <button 
            className="page-arrow-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`page-number-btn ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button 
            className="page-arrow-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            &gt;
          </button>
          <button 
            className="page-arrow-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            &gt;&gt;
          </button>
        </div>
      )}

      <NoticeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}

export default NoticePage;