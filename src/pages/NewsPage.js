import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const mockNews = [
  { id: 1, topic: 'economy', category: 'Update', titleKey: 'NewsPage_title_1', summaryKey: 'NewsPage_summary_1', date: '2026. 05. 24', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
  { id: 2, topic: 'labor', category: 'Law', titleKey: 'NewsPage_title_2', summaryKey: 'NewsPage_summary_2', date: '2026. 05. 20', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80' },
  { id: 3, topic: 'economy', category: 'Global', titleKey: 'NewsPage_title_3', summaryKey: 'NewsPage_summary_3', date: '2026. 05. 15', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80' },
  { id: 4, topic: 'labor', category: 'Safety', titleKey: 'NewsPage_title_4', summaryKey: 'NewsPage_summary_4', date: '2026. 05. 10', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' },
  { id: 5, topic: 'economy', category: 'Market', titleKey: 'NewsPage_title_5', summaryKey: 'NewsPage_summary_5', date: '2026. 05. 08', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
  { id: 6, topic: 'labor', category: 'Policy', titleKey: 'NewsPage_title_6', summaryKey: 'NewsPage_summary_6', date: '2026. 05. 05', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80' },
  { id: 7, topic: 'economy', category: 'Finance', titleKey: 'NewsPage_title_7', summaryKey: 'NewsPage_summary_7', date: '2026. 05. 02', imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80' },
  { id: 8, topic: 'labor', category: 'Support', titleKey: 'NewsPage_title_8', summaryKey: 'NewsPage_summary_8', date: '2026. 04. 28', imageUrl: 'https://images.unsplash.com/photo-1521791136366-3e553771295d?auto=format&fit=crop&w=600&q=80' }
];

function NewsPage() {
  const { t } = useTranslation();
  const [activeTopic, setActiveTopic] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 6;

  const filteredNews = activeTopic === 'all' 
    ? mockNews 
    : mockNews.filter(news => news.topic === activeTopic);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentNewsItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const handleTopicChange = (topic) => {
    setActiveTopic(topic);
    setCurrentPage(1);
  };

  return (
    <div className="news-page-container">
      <header className="news-header">
        <h1>{t('NewsPage_header_title')}</h1>
        <p>{t('NewsPage_header_subtitle')}</p>
      </header>

      {/* 토픽 선택 탭 */}
      <div className="topic-tabs">
        <button className={`topic-tab-btn ${activeTopic === 'all' ? 'active' : ''}`} onClick={() => handleTopicChange('all')}>
          {t('NewsPage_tab_all')}
        </button>
        <button className={`topic-tab-btn ${activeTopic === 'economy' ? 'active' : ''}`} onClick={() => handleTopicChange('economy')}>
          {t('NewsPage_tab_economy')}
        </button>
        <button className={`topic-tab-btn ${activeTopic === 'labor' ? 'active' : ''}`} onClick={() => handleTopicChange('labor')}>
          {t('NewsPage_tab_labor')}
        </button>
      </div>

      {/* 뉴스 그리드 영역 */}
      <section className="news-grid-3cols">
        {currentNewsItems.map((news) => (
          <article key={news.id} className="news-card">
            <div className="news-image-wrapper">
              <img src={news.imageUrl} alt={t(news.titleKey)} className="news-image" />
            </div>
            <div className="news-content">
              <span className="news-category">{news.category}</span>
              <h3 className="news-title">{t(news.titleKey)}</h3>
              <p className="news-summary">{t(news.summaryKey)}</p>
              <time className="news-date">{news.date}</time>
            </div>
          </article>
        ))}
      </section>

      {/* 페이지네이션 하단 버튼 */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="page-arrow-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
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
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default NewsPage;