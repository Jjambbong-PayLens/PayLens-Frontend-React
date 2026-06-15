import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getReviewData, submitReviewData, analyzeDocumentFinal, getAnalysisResult } from '../utils/documentApi';

function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisId } = location.state || {};

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({}); // { [groupId]: { 필드명: 값 } }
  const [activeGroupId, setActiveGroupId] = useState(null); // 현재 선택된 탭

  useEffect(() => {
    if (!analysisId) {
      alert("잘못된 접근입니다.");
      navigate('/analysis');
      return;
    }

    const fetchReviewData = async () => {
      try {
        const data = await getReviewData(analysisId);
        setReviewData(data);

        // 초기 폼 데이터 및 첫 번째 탭 세팅
        if (data && data.documentGroups && data.documentGroups.length > 0) {
          const initialFormData = {};
          data.documentGroups.forEach(group => {
            initialFormData[group.groupId] = { ...group.extractedFields };
          });
          setFormData(initialFormData);
          setActiveGroupId(data.documentGroups[0].groupId);
        }

      } catch (error) {
        console.error("리뷰 데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [analysisId, navigate]);

  const handleFieldChange = (groupId, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = async () => {
    // 하나라도 재촬영이 필요하면 제출 방지
    const needsRecapture = reviewData.documentGroups.some(group => group.recaptureRequired);
    if (needsRecapture) {
      alert("재촬영이 필요한 문서가 있습니다. 다시 업로드해 주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = Object.keys(formData).map(groupId => ({
        groupId: groupId,
        confirmedFields: formData[groupId]
      }));

      // 1. 사용자 확인 폼 제출 (POST)
      await submitReviewData(analysisId, payload);

      // 2. 최종 분석 요청 (POST)
      await analyzeDocumentFinal(analysisId);

      // 3. 최종 분석 결과 조회 (GET) - 명세서 반영
      const analysisData = await getAnalysisResult(analysisId);

      // 4. 결과 페이지로 이동
      navigate("/result", {
        state: {
          analysisResult: analysisData,
          documentIds: reviewData.documentGroups.flatMap(g => g.sourceDocuments.map(doc => doc.documentId))
        },
      });

    } catch (error) {
      console.error("검증 제출 실패:", error);
      alert("분석 요청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
      <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>문서 인식 결과를 불러오는 중입니다...</p>
      </main>
  );

  if (!reviewData || !reviewData.documentGroups) return <div>데이터가 없습니다.</div>;

  const activeGroup = reviewData.documentGroups.find(g => g.groupId === activeGroupId);

  return (
      <main className="page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h2>문서 인식 결과 확인</h2>
          <p>AI가 인식한 내용입니다. 잘못된 값이 있다면 수정해 주세요.</p>
        </header>

        {/* 상단 탭 구현 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          {reviewData.documentGroups.map((group) => (
              <button
                  key={group.groupId}
                  onClick={() => setActiveGroupId(group.groupId)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: activeGroupId === group.groupId ? '#1E1B4B' : '#f1f5f9',
                    color: activeGroupId === group.groupId ? 'white' : '#475569',
                    borderRadius: '8px 8px 0 0',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
              >
                {group.documentTypeLabel}
                {group.recaptureRequired && ' ⚠️'}
              </button>
          ))}
        </div>

        {/* 탭 내용 (왼쪽: 뷰어 / 오른쪽: 폼) */}
        {activeGroup && (
            <section style={{ border: '1px solid #e2e8f0', padding: '24px', borderRadius: '0 8px 8px 8px', display: 'flex', gap: '30px', backgroundColor: 'white' }}>

              {/* 왼쪽: 문서 뷰어 */}
              <div style={{ flex: 1, minWidth: '0' }}>
                <h3 style={{ marginBottom: '15px' }}>원본 문서</h3>

                {activeGroup.recaptureRequired && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                      <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>⚠️ 이 문서는 다시 촬영이 필요합니다.</p>
                      <p style={{ margin: 0 }}>사유: {activeGroup.reason}</p>
                      <button
                          onClick={() => navigate('/analysis')}
                          style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        다시 업로드하러 가기
                      </button>
                    </div>
                )}

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'auto', height: '600px', backgroundColor: '#f8fafc', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeGroup.sourceDocuments.map(doc => (
                      <div key={doc.documentId} style={{ display: 'flex', justifyContent: 'center' }}>
                        {doc.contentType.startsWith('image/') ? (
                            <img src={doc.viewUrl} alt={doc.fileName} style={{ maxWidth: '100%', objectFit: 'contain' }} />
                        ) : doc.contentType === 'application/pdf' ? (
                            <iframe src={doc.viewUrl} title={doc.fileName} style={{ width: '100%', height: '500px', border: 'none' }} />
                        ) : (
                            <p>미리보기를 지원하지 않는 형식입니다.</p>
                        )}
                      </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: 폼 데이터 */}
              <div style={{ width: '400px', flexShrink: 0 }}>
                <h3 style={{ marginBottom: '15px' }}>인식된 내용 수정</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {!activeGroup.recaptureRequired && formData[activeGroup.groupId] ? (
                      Object.keys(formData[activeGroup.groupId]).map(fieldName => (
                          <div key={fieldName} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>{fieldName}</label>
                            <input
                                type="text"
                                value={formData[activeGroup.groupId][fieldName] || ''}
                                onChange={(e) => handleFieldChange(activeGroup.groupId, fieldName, e.target.value)}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                            />
                          </div>
                      ))
                  ) : (
                      <p style={{ color: '#64748b' }}>인식된 필드가 없거나 재촬영이 필요합니다.</p>
                  )}
                </div>
              </div>

            </section>
        )}

        {/* 하단 버튼 */}
        <div style={{ marginTop: '40px', textAlign: 'center', marginBottom: '60px' }}>
          <button
              onClick={handleSubmit}
              disabled={submitting || reviewData.documentGroups.some(g => g.recaptureRequired)}
              style={{
                padding: '16px 60px',
                backgroundColor: submitting || reviewData.documentGroups.some(g => g.recaptureRequired) ? '#94A3B8' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: submitting || reviewData.documentGroups.some(g => g.recaptureRequired) ? 'not-allowed' : 'pointer'
              }}
          >
            {submitting ? '최종 분석 진행 중...' : '확인 완료 및 최종 분석 시작'}
          </button>
        </div>
      </main>
  );
}

export default ReviewPage;