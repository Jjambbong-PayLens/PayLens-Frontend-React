import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLabors } from '../utils/documentApi';

function ExpertFinder() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 💡 권한 및 본인 확인용 임시 State (로그인 유저 정보에서 가져와야 함)
  const currentUser = {
    id: 101, // 현재 로그인한 유저 ID (김민수 노무사와 동일하게 설정하여 테스트)
    role: 'LABOR_ATTORNEY' // 권한
  };

// 🌟 서버에서 받아올 데이터 상태 관리
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedSpecialty, setSelectedSpecialty] = useState('전체');

  const regions = ['전체', '서울', '경기', '인천', '부산', '기타'];
  const specialties = ['전체', '임금체불', '부당해고', '산업재해', '직장내괴롭힘', '노사관계'];

  // 🚀 목록 API 호출 로직
  useEffect(() => {
    const fetchExpertList = async () => {
      try {
        setIsLoading(true);
        const data = await getLabors();
        // 백엔드 응답이 배열 형태라고 가정하고 상태에 저장
        setExperts(data || []); 
      } catch (error) {
        console.error('전문가 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpertList();
  }, []);

// 🌟 mockExperts 대신 실제 데이터인 experts를 필터링합니다
  const filteredExperts = experts.filter(expert => {
    // 주의: 백엔드에서 넘어오는 필드명(expert.region 등)이 스웨거와 일치해야 합니다!
    const matchRegion = selectedRegion === '전체' || expert.region === selectedRegion;
    const matchSpecialty = selectedSpecialty === '전체' || (expert.specialties && expert.specialties.includes(selectedSpecialty));
    return matchRegion && matchSpecialty;
  });

  // 액션 핸들러
  const handleCardClick = (expertId) => {
    navigate(`/expert/${expertId}`); // 상세 페이지로 이동
  };

  const handleEdit = (e, expertId) => {
    e.stopPropagation(); // 카드 클릭 이벤트(상세보기) 방지
    console.log(`${expertId}번 노무사 프로필 수정`);
    // navigate(`/expert/edit/${expertId}`);
  };

  const handleDelete = (e, expertId) => {
    e.stopPropagation();
    if (window.confirm('정말로 프로필을 삭제하시겠습니까?')) {
      console.log(`${expertId}번 노무사 프로필 삭제 API 호출`);
    }
  };

  return (
    <div className="expert-finder-container">
      <header className="expert-header">
        <h1>전문가 찾기</h1>
        <p>검증된 공인노무사와 함께 노동 문제를 확실하게 해결하세요.</p>
      </header>

      <div className="expert-layout">
        {/* 📌 왼쪽 필터 사이드바 */}
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

        {/* 📌 오른쪽 전문가 카드 리스트 */}
        <main className="expert-content">
          <div className="content-header">
            <span>총 <strong>{filteredExperts.length}</strong>명의 전문가가 있습니다.</span>
          </div>

          <div className="expert-grid">
            {filteredExperts.map(expert => {
              // 본인 프로필인지 확인
              const isMine = currentUser.role === 'LABOR_ATTORNEY' && currentUser.id === expert.userId;

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
                      {expert.specialties.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>

                    {/* 🌟 본인 프로필일 경우에만 수정/삭제 버튼 노출 */}
                    {isMine && (
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
    </div>
  );
}

export default ExpertFinder;