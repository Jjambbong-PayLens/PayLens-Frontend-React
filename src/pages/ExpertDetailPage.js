import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpertDetail } from '../utils/documentApi';

function ExpertDetailPage() {
  const { expertId } = useParams(); // URL에서 ID 추출
  const navigate = useNavigate();
  
  const [expert, setExpert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 상세 API 호출 로직
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getExpertDetail(expertId);
        setExpert(data);
      } catch (error) {
        console.error('상세 정보 호출 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (expertId) fetchDetail();
  }, [expertId]);

  if (isLoading) return <div>불러오는 중...</div>;
  if (!expert) return <div>전문가 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="expert-detail-container">
      <h1>{expert.name} 노무사 상세 프로필</h1>
      <p>{expert.company} | {expert.region}</p>
      <p>{expert.description}</p>
      {/* 화면 디자인에 맞게 UI를 자유롭게 추가하세요! */}
      <button onClick={() => navigate(-1)}>목록으로 돌아가기</button>
    </div>
  );
}

export default ExpertDetailPage;