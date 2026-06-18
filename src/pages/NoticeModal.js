import React, { useState, useEffect } from 'react';
import { createNotice, updateNotice } from '../utils/documentApi'; // updateNotice 추가

// 🌟 initialData가 넘어오면 '수정 모드', 안 넘어오면 '작성 모드'로 작동합니다.
function NoticeModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('NOTICE');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 모달이 열릴 때, initialData가 있으면 폼에 채워넣고 없으면 초기화합니다.
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setCategory(initialData.category || 'NOTICE');
        setContent(initialData.content || '');
        setThumbnailUrl(initialData.thumbnailUrl || '');
      } else {
        setTitle('');
        setCategory('NOTICE');
        setContent('');
        setThumbnailUrl('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // 수정 모드인지 판별하는 플래그
  const isEditMode = !!initialData; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        title: title,
        content: content,
        thumbnailUrl: thumbnailUrl || "",
        category: category 
      };

      if (isEditMode) {
        // 🚀 수정 (PUT) 모드
        await updateNotice(initialData.noticeId, requestBody);
        alert('공지사항이 성공적으로 수정되었습니다.');
      } else {
        // 🚀 작성 (POST) 모드
        await createNotice(requestBody);
        alert('공지사항이 성공적으로 등록되었습니다.');
      }

      onSuccess(); 
      onClose();

    } catch (error) {
      console.error(`공지사항 ${isEditMode ? '수정' : '작성'} 실패:`, error);
      alert(`공지사항 ${isEditMode ? '수정' : '작성'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {/* 🌟 텍스트 동적 변경 */}
          <h2>{isEditMode ? '공지사항 수정' : '새 공지사항 작성'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form className="notice-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>분류 <span className="required">*</span></label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="NOTICE">일반공지</option>
              <option value="EVENT">이벤트</option>
              <option value="UPDATE">업데이트</option>
            </select>
          </div>

          <div className="form-group">
            <label>제목 <span className="required">*</span></label>
            <input 
              type="text" 
              placeholder="공지사항 제목을 입력하세요" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>썸네일 이미지 URL (선택)</label>
            <input 
              type="text" 
              placeholder="https://... (이미지 링크가 있다면 입력)" 
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>

          <div className="form-group content-group">
            <label>내용 <span className="required">*</span></label>
            <textarea 
              placeholder="공지사항 본문을 입력하세요" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              취소
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditMode ? '수정 중...' : '등록 중...') 
                : (isEditMode ? '수정 완료' : '작성 완료')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoticeModal;