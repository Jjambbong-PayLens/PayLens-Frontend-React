import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLabors, updateLaborProfile, deleteLaborProfile, applyLaborRole, requestUploadUrls, uploadFilesToS3, completeUploads } from '../utils/documentApi';
import { useRef } from 'react';
import AdminLaborModal from './AdminLaborModal';
import ProfileFormModal from './ProfileFormModal'; // 1. 모달 컴포넌트 import
import { getUser } from '../utils/auth';

function ExpertFinder() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentUser = { id: 123, role: "ADMIN" }; // 임시 관리자 권한 설정

  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminModalInitialView, setAdminModalInitialView] = useState(null);
  
  // 2. 모달 제어용 상태 추가
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedSpecialty, setSelectedSpecialty] = useState('전체');

  const isAdmin = currentUser?.role === 'ADMIN';
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const adminCardRef = useRef(null);

  const regions = ['전체', '서울', '경기', '인천', '부산', '기타'];
  const specialties = ['전체', '임금체불', '부당해고', '산업재해', '직장내괴롭힘', '노사관계'];

  const fetchExpertList = async () => {
    try {
      setIsLoading(true);
      const data = await getLabors();
      setExperts(data || []); 
    } catch (error) {
      console.error('전문가 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertList();
  }, []);

  useEffect(() => {
    const updateTop = () => {
      if (adminCardRef?.current) {
        const rect = adminCardRef.current.getBoundingClientRect();
        const top = window.scrollY + rect.top + (rect.height - 36) / 2;
      }
    };

    updateTop();
    window.addEventListener('resize', updateTop);
    window.addEventListener('scroll', updateTop, { passive: true });
    return () => {
      window.removeEventListener('resize', updateTop);
      window.removeEventListener('scroll', updateTop);
    };
  }, [adminCardRef, isUploading]);

  const filteredExperts = experts.filter(expert => {
    const expertRegion = (expert.region || '').toString();
    const matchRegion = selectedRegion === '전체' || (expertRegion && expertRegion.toLowerCase() === selectedRegion.toLowerCase());

    let expertSpecialties = [];
    if (Array.isArray(expert.specialties)) {
      expertSpecialties = expert.specialties.map(s => (s || '').toString());
    } else if (typeof expert.specialties === 'string') {
      expertSpecialties = expert.specialties.split(',').map(s => s.trim());
    }

    const matchSpecialty = selectedSpecialty === '전체' || expertSpecialties.some(s => s && s.toLowerCase() === selectedSpecialty.toLowerCase());

    return matchRegion && matchSpecialty;
  });

  const handleCardClick = (expertId) => {
    navigate(`/expert/${expertId}`);
  };

  const handleEdit = (e, expertId) => {
    e.stopPropagation();
    const newName = window.prompt('변경할 이름을 입력하세요 (취소 시 중단)');
    if (!newName) return;

    (async () => {
      try {
        await updateLaborProfile(expertId, { name: newName });
        setExperts((prev) => prev.map((item) => (
          item.id === expertId ? { ...item, name: newName } : item
        )));
        alert('프로필 수정 성공');
      } catch (error) {
        console.error('프로필 수정 실패:', error);
        alert('프로필 수정 실패: ' + error.message);
      }
    })();
  };

  const handleDelete = (e, expertId) => {
    e.stopPropagation();
    if (!window.confirm('정말로 프로필을 삭제하시겠습니까?')) return;

    (async () => {
      try {
        await deleteLaborProfile(expertId);
        setExperts((prev) => prev.filter((item) => item.id !== expertId));
        alert('프로필 삭제 성공');
      } catch (error) {
        console.error('프로필 삭제 실패:', error);
        alert('프로필 삭제 실패: ' + error.message);
      }
    })();
  };

  const validateUploadFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(
      (file) => file.type === 'application/pdf' || file.type.startsWith('image/')
    );

    if (validFiles.length !== selectedFiles.length) {
      alert('PDF 또는 이미지 파일(JPG, PNG, WEBP 등)만 업로드할 수 있습니다.');
    }

    return validFiles;
  };

  // 5. 모달에서 프로필 생성 성공 시 호출될 함수
  const handleProfileCreated = (newProfile) => {
    // 목록 맨 앞에 새 프로필 추가
    setExperts(prev => [newProfile, ...prev]);
  };

  return (
    <div className="expert-finder-container">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 25, flexWrap: 'wrap', marginBottom: 12 }}>
        
        {/* 4. 기존 테스트 버튼을 새로운 버튼으로 교체 */}
        <button 
          onClick={() => setIsProfileModalOpen(true)} 
          style={{padding: '10px 15px', border: '1px solid #1e40af', color: '#1e40af', backgroundColor: '#eff6ff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
        >
          ✨ 신규 프로필 등록
        </button>

        {isAdmin && (
          <section ref={adminCardRef} className="card admin-section" style={{
            marginTop: '0',
            marginBottom: '0',
            width: 'fit-content',
            padding: '10px 14px',
            border: '1px solid #c7bbff',
            backgroundColor: '#faf5ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#695cc7' }}>👑 노무사 대기 관리</span>
              <button
                style={{
                  height: '36px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  backgroundColor: '#877dde',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() => { setAdminModalInitialView('pending'); setIsAdminModalOpen(true); }}
              >
                열기
              </button>
            </div>
          </section>
        )}

        <section className="card admin-section" style={{
          marginTop: '0',
          marginBottom: '0',
          width: 'fit-content',
          padding: '10px 14px',
          border: '1px solid #c7bbff',
          backgroundColor: '#faf5ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#695cc7' }}>📝 노무사 신청</span>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf, image/jpeg, image/png, image/webp"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const files = validateUploadFiles(Array.from(e.target.files || []));
                if (files.length === 0) return;

                if (!window.confirm(`선택한 ${files.length}개 파일로 등업 신청을 진행하시겠습니까?`)) {
                  e.target.value = null;
                  return;
                }

                setIsUploading(true);
                try {
                  const uploadUrlResult = await requestUploadUrls(files);
                  const uploadInfos = Array.isArray(uploadUrlResult) ? uploadUrlResult : (uploadUrlResult?.files || uploadUrlResult?.uploadInfos || uploadUrlResult?.uploadUrls || []);

                  await uploadFilesToS3(files, uploadInfos);

                  const documentIds = uploadInfos.map((info) => info.documentId).filter(Boolean);
                  if (documentIds.length > 0) {
                    await completeUploads(documentIds);
                  }

                  await applyLaborRole();
                  alert('등업 신청이 접수되었습니다.');
                } catch (err) {
                  console.error('등업 신청 실패:', err);
                  alert('등업 신청에 실패했습니다: ' + (err.message || err));
                } finally {
                  setIsUploading(false);
                  e.target.value = null;
                }
              }}
            />

            <button
              className="primary-button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={isUploading}
              style={{
                height: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 14px',
                borderRadius: '6px',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                color: '#877DDE',
                fontSize: '13px',
                border: '2px solid #877DDE'
              }}
            >
              {isUploading ? '업로드 중...' : '등록'}
            </button>
          </div>
        </section>
      </div>
          
      <header className="expert-header">
        <h1>전문가 찾기</h1>
        <p>검증된 공인노무사와 함께 노동 문제를 확실하게 해결하세요.</p>
      </header>

      <div className="expert-layout">
        <aside className="expert-sidebar">
          <div className="filter-group">
            <h3>지역</h3>
            <ul className="filter-list">
              {regions.map(region => (
                <li 
                  key={region} 
                  className={selectedRegion === region ? 'active' : ''}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>전문 분야</h3>
            <ul className="filter-list">
              {specialties.map(spec => (
                <li 
                  key={spec} 
                  className={selectedSpecialty === spec ? 'active' : ''}
                  onClick={() => setSelectedSpecialty(spec)}
                >
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="expert-content">
          <div className="content-header">
            <span>총 <strong>{filteredExperts.length}</strong>명의 전문가가 있습니다.</span>
          </div>

          <div className="expert-grid">
            {filteredExperts.map(expert => {
              const isMine = currentUser.role === 'LABOR_ATTORNEY' && currentUser.id === expert.userId;
              const canManageProfile = isAdmin || isMine;

              return (
                <div key={expert.id} className="expert-card" onClick={() => handleCardClick(expert.id)}>
                  
                  <div className="card-top">
                    <img src={expert.imageUrl} alt={`${expert.name} 노무사`} className="expert-image" />
                    <div className="expert-info">
                      <h2 className="expert-name">{expert.name} <span>{expert.title}</span></h2>
                      <p className="expert-company">{expert.company}</p>
                      <p className="expert-region">📍 {expert.region}</p>
                    </div>
                  </div>

                  <div className="card-middle">
                    <p className="expert-desc">"{expert.description}"</p>
                  </div>

                  <div className="card-bottom">
                    <div className="expert-tags">
                      {(Array.isArray(expert.specialties) ? expert.specialties : (expert.specialties ? expert.specialties.toString().split(',').map(s=>s.trim()) : [])).map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>

                    {canManageProfile && (
                      <div className="card-actions">
                        <button className="edit-btn" onClick={(e) => handleEdit(e, expert.id)}>수정</button>
                        <button className="delete-btn" onClick={(e) => handleDelete(e, expert.id)}>삭제</button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}

            {filteredExperts.length === 0 && (
              <div className="empty-state">
                <p>조건에 맞는 전문가가 없습니다.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <AdminLaborModal isOpen={isAdminModalOpen} onClose={() => { setIsAdminModalOpen(false); setAdminModalInitialView(null); }} initialView={adminModalInitialView} />
      
      {/* 페이지 맨 아래에 모달 컴포넌트 추가 */}
      <ProfileFormModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        onProfileCreated={handleProfileCreated}
      />
      
    </div>
  );
}

export default ExpertFinder;