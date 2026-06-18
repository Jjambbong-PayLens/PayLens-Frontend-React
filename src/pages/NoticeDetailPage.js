import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getNoticeDetail, deleteNotice, verifyUserAuth } from '../utils/documentApi'; // 작성해둔 API 함수 임포트
import NoticeModal from './NoticeModal';

const categoryMap = {
  NOTICE: '일반공지',
  EVENT: '이벤트',
  UPDATE: '업데이트'
};

function NoticeDetailPage() {
  const { t } = useTranslation();
  const { noticeId } = useParams(); // URL에서 /notice/123 의 '123'을 가져옴
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 상세 조회 API 호출
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getNoticeDetail(noticeId);
        setNotice(data); // apiFetch가 result 객체를 바로 뱉어주므로 그대로 저장!
      } catch (err) {
        console.error('상세 정보 조회 실패:', err);
        setError(err.message || '공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (noticeId) {
      fetchDetail();
    }
  }, [noticeId]);

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userInfo = await verifyUserAuth();
        setIsAdmin(userInfo?.role === 'ADMIN');
      } catch (err) {
        console.error('권한 확인 실패:', err);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // 🚀 삭제 API 호출
  const handleDelete = async () => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deleteNotice(noticeId);
        alert('삭제가 완료되었습니다.');
        navigate('/notice', { replace: true }); // 삭제 후 목록으로 강제 이동
      } catch (err) {
        alert(`삭제 실패: ${err.message}`);
      }
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  const handleEditSuccess = () => {
    // 상세 페이지 다시 불러오기 로직 (fetchDetail 등)
    window.location.reload(); 
  };

  if (isLoading) return <div className="notice-detail-message">데이터를 불러오는 중입니다...</div>;
  if (error) return <div className="notice-detail-message error">{error}</div>;
  if (!notice) return <div className="notice-detail-message">공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="notice-detail-container">
      {/* 상세창 헤더 */}
      <header className="detail-header">
        <span className={`badge ${notice.category.toLowerCase()}`}>
          {categoryMap[notice.category]}
        </span>
        <h1 className="detail-title">{notice.title}</h1>
        <div className="detail-meta">
          <span className="meta-date">{formatDate(notice.createdAt)}</span>
        </div>
      </header>

      {/* 본문 영역 */}
      <section className="detail-body">
        {notice.thumbnailUrl && (
          <div className="detail-thumbnail">
            <img src={notice.thumbnailUrl} alt="공지사항 썸네일" />
          </div>
        )}
        
        {/* 본문 텍스트 (줄바꿈 유지를 위해 CSS pre-wrap 적용됨) */}
        <div className="detail-content">
          {notice.content}
        </div>
      </section>

      <div className="detail-footer">
        <button className="list-btn" onClick={() => navigate('/notice')}>
          목록으로
        </button>
        
        {/* 관리자에게만 보이는 수정/삭제 버튼 */}
        {isAdmin && (
          <div className="admin-actions">
            <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>
              수정
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>
      <NoticeModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={handleEditSuccess} 
        initialData={notice} 
      />
    </div>
  );
}

export default NoticeDetailPage;