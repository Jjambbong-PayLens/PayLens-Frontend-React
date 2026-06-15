import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getReviewData,
  submitReviewData,
  analyzeDocumentFinal,
  getAnalysisResult,
} from "../utils/documentApi";

const FIELD_SETS = {
  PAYSLIP: [
    "업체명",
    "근로자명",
    "기본급",
    "연장근로수당",
    "야간근로수당",
    "휴일근로수당",
    "가족수당/식대",
    "총지급액",
    "총공제액",
    "실수령액",
    "임금지급일",
  ],
  EMPLOYMENT_CONTRACT: [
    "업체명",
    "근로자명",
    "근로계약기간",
    "근로시간",
    "휴게시간",
    "휴일",
    "월 통상임금",
    "기본급",
    "고정수당",
    "상여금",
    "임금지급일",
    "임금지급방법",
    "숙식 제공",
    "근로자 부담금",
  ],
  OTHER: ["업체명", "근로자명", "문서유형", "확인된 내용"],
};

function unwrapApiResult(value) {
  let current = value;

  for (let i = 0; i < 5; i++) {
    if (!current || typeof current !== "object") return current;

    if (current.documentGroups || current.analysisId || current.status) {
      return current;
    }

    if (current.result) {
      current = current.result;
      continue;
    }

    if (current.data) {
      current = current.data;
      continue;
    }

    break;
  }

  return current;
}

function getGroupType(group) {
  const type = group?.documentType;

  if (type === "PAYSLIP") return "PAYSLIP";
  if (type === "EMPLOYMENT_CONTRACT") return "EMPLOYMENT_CONTRACT";

  return "OTHER";
}

function getFieldList(group) {
  const type = getGroupType(group);
  const baseFields = FIELD_SETS[type] || FIELD_SETS.OTHER;
  const extractedFields = group?.extractedFields || {};

  const extraFields = Object.keys(extractedFields).filter(
      (fieldName) => !baseFields.includes(fieldName)
  );

  return [...baseFields, ...extraFields];
}

function buildInitialFormData(documentGroups) {
  const initialFormData = {};

  documentGroups.forEach((group) => {
    const fields = getFieldList(group);
    const extractedFields = group.extractedFields || {};

    initialFormData[group.groupId] = {};

    fields.forEach((fieldName) => {
      initialFormData[group.groupId][fieldName] =
          extractedFields[fieldName] === undefined || extractedFields[fieldName] === null
              ? ""
              : extractedFields[fieldName];
    });
  });

  return initialFormData;
}

function normalizeSubmitValue(value) {
  if (value === undefined || value === null) return null;

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
}

function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const {
    analysisId: stateAnalysisId,
    documentIds: stateDocumentIds,
  } = location.state || {};

  const analysisId = stateAnalysisId || params.analysisId;

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({});
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeDocIndexByGroup, setActiveDocIndexByGroup] = useState({});

  useEffect(() => {
    if (!analysisId) {
      alert("잘못된 접근입니다.");
      navigate("/analysis");
      return;
    }

    const fetchReviewData = async () => {
      try {
        setLoading(true);

        const rawData = await getReviewData(analysisId);
        const data = unwrapApiResult(rawData);

        if (!data?.documentGroups || data.documentGroups.length === 0) {
          throw new Error("검증할 문서 그룹이 없습니다.");
        }

        setReviewData(data);
        setFormData(buildInitialFormData(data.documentGroups));
        setActiveGroupId(data.documentGroups[0].groupId);

        const initialDocIndex = {};
        data.documentGroups.forEach((group) => {
          initialDocIndex[group.groupId] = 0;
        });
        setActiveDocIndexByGroup(initialDocIndex);
      } catch (error) {
        console.error("리뷰 데이터 로드 실패:", error);
        alert(error.message || "데이터를 불러오는데 실패했습니다.");
        navigate("/analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [analysisId, navigate]);

  const handleFieldChange = (groupId, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [fieldName]: value,
      },
    }));
  };

  const handlePrevDocument = (groupId, totalLength) => {
    setActiveDocIndexByGroup((prev) => {
      const currentIndex = prev[groupId] || 0;
      const nextIndex = currentIndex === 0 ? totalLength - 1 : currentIndex - 1;

      return {
        ...prev,
        [groupId]: nextIndex,
      };
    });
  };

  const handleNextDocument = (groupId, totalLength) => {
    setActiveDocIndexByGroup((prev) => {
      const currentIndex = prev[groupId] || 0;
      const nextIndex = currentIndex === totalLength - 1 ? 0 : currentIndex + 1;

      return {
        ...prev,
        [groupId]: nextIndex,
      };
    });
  };

  const buildSubmitPayload = () => {
    return {
      documentGroups: reviewData.documentGroups.map((group) => {
        const groupFields = formData[group.groupId] || {};
        const confirmedFields = {};

        Object.entries(groupFields).forEach(([fieldName, value]) => {
          confirmedFields[fieldName] = normalizeSubmitValue(value);
        });

        return {
          groupId: group.groupId,
          confirmedFields,
        };
      }),
    };
  };

  const getAllDocumentIds = () => {
    const idsFromReviewData =
        reviewData?.documentGroups?.flatMap((group) =>
            (group.sourceDocuments || []).map((doc) => doc.documentId)
        ) || [];

    if (idsFromReviewData.length > 0) return idsFromReviewData;
    if (stateDocumentIds?.length > 0) return stateDocumentIds;

    return [];
  };

  const handleSubmit = async () => {
    const needsRecapture = reviewData.documentGroups.some(
        (group) => group.recaptureRequired
    );

    if (needsRecapture) {
      alert("재촬영이 필요한 문서가 있습니다. 다시 업로드해 주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = buildSubmitPayload();

      await submitReviewData(analysisId, payload);
      await analyzeDocumentFinal(analysisId);

      const analysisData = await getAnalysisResult(analysisId);

      navigate("/result", {
        state: {
          analysisResult: analysisData,
          documentIds: getAllDocumentIds(),
        },
      });
    } catch (error) {
      console.error("검증 제출 실패:", error);
      alert(error.message || "분석 요청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <main
            className="page"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
        >
          <p>문서 인식 결과를 불러오는 중입니다...</p>
        </main>
    );
  }

  if (!reviewData || !reviewData.documentGroups) {
    return (
        <main className="page">
          <p>데이터가 없습니다.</p>
        </main>
    );
  }

  const activeGroup = reviewData.documentGroups.find(
      (group) => group.groupId === activeGroupId
  );

  const activeDocuments = activeGroup?.sourceDocuments || [];
  const activeDocIndex = activeDocIndexByGroup[activeGroupId] || 0;
  const activeDocument = activeDocuments[activeDocIndex];

  const hasRecaptureDocument = reviewData.documentGroups.some(
      (group) => group.recaptureRequired
  );

  return (
      <main
          className="page"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
          }}
      >
        <header style={{ marginBottom: "20px" }}>
          <p className="eyebrow">review</p>
          <h2>문서 인식 결과 확인</h2>
          <p>AI가 인식한 내용입니다. 잘못된 값이 있다면 수정해 주세요.</p>
        </header>

        <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "10px",
              flexWrap: "wrap",
            }}
        >
          {reviewData.documentGroups.map((group) => (
              <button
                  key={group.groupId}
                  type="button"
                  onClick={() => setActiveGroupId(group.groupId)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    background: activeGroupId === group.groupId ? "#1E1B4B" : "#f1f5f9",
                    color: activeGroupId === group.groupId ? "white" : "#475569",
                    borderRadius: "8px 8px 0 0",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
              >
                {group.documentTypeLabel || group.documentType || "문서"}
                {group.recaptureRequired && " ⚠️"}
              </button>
          ))}
        </div>

        {activeGroup && (
            <section
                style={{
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  borderRadius: "0 8px 8px 8px",
                  display: "flex",
                  gap: "30px",
                  backgroundColor: "white",
                  alignItems: "flex-start",
                }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ marginBottom: "15px" }}>원본 문서</h3>

                {activeGroup.reason && (
                    <div
                        style={{
                          backgroundColor: activeGroup.recaptureRequired ? "#fee2e2" : "#fff7ed",
                          color: activeGroup.recaptureRequired ? "#b91c1c" : "#9a3412",
                          padding: "15px",
                          borderRadius: "8px",
                          marginBottom: "15px",
                        }}
                    >
                      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>
                        {activeGroup.recaptureRequired
                            ? "⚠️ 이 문서는 다시 촬영이 필요합니다."
                            : "⚠️ 사용자 확인이 필요합니다."}
                      </p>

                      <p style={{ margin: 0 }}>사유: {activeGroup.reason}</p>

                      {activeGroup.recaptureRequired && (
                          <button
                              type="button"
                              onClick={() => navigate("/analysis")}
                              style={{
                                marginTop: "10px",
                                padding: "8px 16px",
                                backgroundColor: "#b91c1c",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                          >
                            다시 업로드하러 가기
                          </button>
                      )}
                    </div>
                )}

                {activeGroup.missingFields?.length > 0 && (
                    <div
                        style={{
                          backgroundColor: "#fefce8",
                          color: "#854d0e",
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "15px",
                        }}
                    >
                      <strong>누락된 항목: </strong>
                      {activeGroup.missingFields.join(", ")}
                    </div>
                )}

                <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#f8fafc",
                    }}
                >
                  {activeDocuments.length > 1 && (
                      <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            borderBottom: "1px solid #e2e8f0",
                            backgroundColor: "white",
                          }}
                      >
                        <button
                            type="button"
                            onClick={() =>
                                handlePrevDocument(activeGroup.groupId, activeDocuments.length)
                            }
                        >
                          이전
                        </button>

                        <span style={{ fontWeight: "bold" }}>
                    {activeDocument?.fileName || "문서"} ({activeDocIndex + 1}/
                          {activeDocuments.length})
                  </span>

                        <button
                            type="button"
                            onClick={() =>
                                handleNextDocument(activeGroup.groupId, activeDocuments.length)
                            }
                        >
                          다음
                        </button>
                      </div>
                  )}

                  <div
                      style={{
                        height: "620px",
                        overflow: "auto",
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                  >
                    {!activeDocument ? (
                        <p>표시할 문서가 없습니다.</p>
                    ) : activeDocument.contentType?.startsWith("image/") ? (
                        <img
                            src={activeDocument.viewUrl}
                            alt={activeDocument.fileName}
                            style={{
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                        />
                    ) : activeDocument.contentType === "application/pdf" ? (
                        <iframe
                            src={activeDocument.viewUrl}
                            title={activeDocument.fileName}
                            style={{
                              width: "100%",
                              height: "600px",
                              border: "none",
                            }}
                        />
                    ) : (
                        <p>미리보기를 지원하지 않는 형식입니다.</p>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ width: "420px", flexShrink: 0 }}>
                <h3 style={{ marginBottom: "15px" }}>인식된 내용 확인/수정</h3>

                <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                >
                  {!activeGroup.recaptureRequired && formData[activeGroup.groupId] ? (
                      Object.keys(formData[activeGroup.groupId]).map((fieldName) => (
                          <div
                              key={fieldName}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                              }}
                          >
                            <label
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "#475569",
                                }}
                            >
                              {fieldName}
                            </label>

                            <input
                                type="text"
                                value={formData[activeGroup.groupId][fieldName] ?? ""}
                                onChange={(event) =>
                                    handleFieldChange(
                                        activeGroup.groupId,
                                        fieldName,
                                        event.target.value
                                    )
                                }
                                placeholder="확인 불가 시 비워두세요"
                                style={{
                                  padding: "10px",
                                  borderRadius: "6px",
                                  border: activeGroup.missingFields?.includes(fieldName)
                                      ? "1px solid #f97316"
                                      : "1px solid #cbd5e1",
                                  fontSize: "15px",
                                }}
                            />
                          </div>
                      ))
                  ) : (
                      <p style={{ color: "#64748b" }}>
                        인식된 필드가 없거나 재촬영이 필요합니다.
                      </p>
                  )}
                </div>
              </div>
            </section>
        )}

        <div
            style={{
              marginTop: "40px",
              textAlign: "center",
              marginBottom: "60px",
            }}
        >
          <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || hasRecaptureDocument}
              style={{
                padding: "16px 60px",
                backgroundColor: submitting || hasRecaptureDocument ? "#94A3B8" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: submitting || hasRecaptureDocument ? "not-allowed" : "pointer",
              }}
          >
            {submitting ? "최종 분석 진행 중..." : "확인 완료 및 최종 분석 시작"}
          </button>

          {hasRecaptureDocument && (
              <p style={{ marginTop: "12px", color: "#b91c1c", fontWeight: "bold" }}>
                재촬영이 필요한 문서가 있어 최종 분석을 진행할 수 없습니다.
              </p>
          )}
        </div>
      </main>
  );
}

export default ReviewPage;