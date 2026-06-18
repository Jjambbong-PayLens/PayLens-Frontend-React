import React, { useState } from 'react';
import { createLaborProfile } from '../utils/documentApi';

function ProfileFormModal({ isOpen, onClose, onProfileCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    officeName: '',
    phone: '',
    email: '',
    kakaoChannel: '',
    region: '',
    specialties: '',
    supportedLanguages: '',
    introduction: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // API 호출
      const newProfile = await createLaborProfile(formData);
      alert('프로필이 성공적으로 등록되었습니다!');
      onProfileCreated(newProfile); // 성공 시 부모 목록 업데이트
      handleClose();

    } catch (err) {
      console.error("프로필 생성 실패:", err);
      setError(err.message || '프로필 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '', officeName: '', phone: '', email: '', kakaoChannel: '',
      region: '', specialties: '', supportedLanguages: '', introduction: '',
    });
    setError(null);
    onClose();
  };

  const modalStyle = {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    backgroundColor: 'white', padding: '30px', borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1000,
    width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
  };

  const backdropStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999
  };

  const inputStyle = { padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc' };

  return (
    <>
      <div style={backdropStyle} onClick={handleClose} />
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>신규 노무사 프로필 등록</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <input name="name" value={formData.name} onChange={handleChange} placeholder="이름 (필수)" required style={inputStyle} />
          <input name="officeName" value={formData.officeName} onChange={handleChange} placeholder="사무소명 (필수)" required style={inputStyle} />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="연락처" style={inputStyle} />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="이메일 (user@example.com)" type="email" style={inputStyle} />
          <input name="kakaoChannel" value={formData.kakaoChannel} onChange={handleChange} placeholder="카카오 채널 링크" style={inputStyle} />
          <input name="region" value={formData.region} onChange={handleChange} placeholder="지역 (예: 서울)" style={inputStyle} />
          <input name="specialties" value={formData.specialties} onChange={handleChange} placeholder="전문 분야 (쉼표로 구분)" style={inputStyle} />
          <input name="supportedLanguages" value={formData.supportedLanguages} onChange={handleChange} placeholder="지원 언어 (쉼표로 구분)" style={inputStyle} />
          <textarea name="introduction" value={formData.introduction} onChange={handleChange} placeholder="소개글을 작성해주세요." rows="4" style={{...inputStyle, resize: 'vertical'}} />

          {error && <p style={{ color: 'red', margin: 0, fontSize: '14px' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={handleClose} disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}>
              취소
            </button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
              {isSubmitting ? '저장 중...' : '등록 완료'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfileFormModal;