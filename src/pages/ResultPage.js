import React, { useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function safeParseJson(value) {
  if (!value) return null;
  
  if (typeof value === "object") {
    return value;
  }

  let cleanValue = value;

  if (typeof value === "string") {
    cleanValue = value.replace(/```json/gi, "").replace(/```/g, "").trim();
  }

  try {
    return JSON.parse(cleanValue);
  } catch (error) {
    console.error("JSON 파싱 에러:", error);
    return value;
  }
}

function ResultPage() {
  const location = useLocation();
  const pdfRef = useRef();

  const documentIds = location.state?.documentIds;
  const rawAnalysisResult = location.state?.analysisResult;

  if (!rawAnalysisResult) {
    return <Navigate to="/analysis" replace />;
  }

  const data = safeParseJson(rawAnalysisResult);

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    
    // PDF 다운로드 버튼을 숨기기 위해 임시로 스타일 변경
    const btn = element.querySelector('.pdf-btn');
    if(btn) btn.style.display = 'none';

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI_분석결과_${data.문서요약?.근로자명 || '무명'}.pdf`);
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      // 버튼 다시 보이게 복구
      if(btn) btn.style.display = 'block';
    }
  };

  if (typeof data === "string") {
    return (
      <main className="page">
        <section className="result-container" ref={pdfRef}>
          <header className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>AI 분석 결과</h1>
            <button className="pdf-btn" onClick={handleDownloadPdf} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              PDF로 저장
            </button>
          </header>
          <pre>{data}</pre>
        </section>
      </main>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "- 원";
    return amount.toLocaleString() + "원";
  };

  const getBadgeClass = (status) => {
    if (!status) return "badge-neutral";
    if (status.includes("낮음")) return "badge-safe";
    if (status.includes("높음") || status.includes("위험")) return "badge-danger";
    if (status.includes("추가자료필요")) return "badge-warning";
    return "badge-neutral";
  };

  const titleMap = {
    "최저임금및주휴수당": "최저임금 및 주휴수당",
    "퇴직금미지급": "퇴직금 미지급",
    "야간근로수당및휴업수당": "야간근로 및 휴업수당",
    "초과근로수당휴일근로수당연차수당": "초과/휴일/연차수당"
  };

  return (
    <main className="page">
      <div className="result-container" ref={pdfRef} style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        
        <header className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>분석 결과 상세</h1>
            <p>
              {data.문서요약?.확인된기간} {data.문서요약?.사업장명} 급여명세서 분석
              {documentIds && <span style={{fontSize: '12px', color: '#94a3b8', marginLeft: '10px'}}> (문서 ID: {documentIds.join(", ")})</span>}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <button className="pdf-btn" onClick={handleDownloadPdf} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              PDF로 저장
            </button>
            <span className={`status-badge ${getBadgeClass(data.최종판단?.임금체불가능성)}`}>
              {data.최종판단?.임금체불가능성?.split(" ")[0] || "상태 확인 불가"}
            </span>
          </div>
        </header>

        <div className="summary-grid">
          <div className="summary-card">
            <h3>급여 요약</h3>
            <div className="amount-row">
              <span>총 지급액</span>
              <strong>{formatCurrency(data.공통추출항목?.총지급액)}</strong>
            </div>
            <div className="amount-row highlight">
              <span>실수령액</span>
              <strong>{formatCurrency(data.공통추출항목?.실수령액)}</strong>
            </div>
            <div className="amount-row muted">
              <span>공제액</span>
              <span>{formatCurrency(data.공통추출항목?.총공제액)}</span>
            </div>
          </div>

          <div className="summary-card">
            <h3>문서 정보</h3>
            <ul className="info-list">
              <li><span>근로자명</span> <strong>{data.문서요약?.근로자명 || "-"}</strong></li>
              <li><span>문서 유형</span> <strong>{data.문서요약?.문서유형 || "-"}</strong></li>
              <li>
                <span>문서 적합도</span> 
                <strong>{data.문서검증?.문서적합도 || "-"}</strong>
              </li>
              <li><span>지급일</span> <strong>{data.공통추출항목?.급여지급일 || "-"}</strong></li>
            </ul>
          </div>
        </div>

        {data.임금체불분석 && Object.keys(data.임금체불분석).length > 0 && (
          <section className="detail-section">
            <h2>항목별 상세 분석</h2>
            <div className="analysis-list">
              {Object.entries(data.임금체불분석).map(([key, value]) => (
                <div className="analysis-item" key={key}>
                  <div className="item-header">
                    <h4>{titleMap[key] || key}</h4>
                    <span className={`small-badge ${getBadgeClass(value.위반가능성 || value.미지급가능성)}`}>
                      {value.위반가능성 || value.미지급가능성 || "판단 불가"}
                    </span>
                  </div>
                  <p className="item-reason">{value.판단근거?.[0] || "판단 근거가 없습니다."}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.최종판단 && (
          <section className="ai-opinion-section">
            <h2>🤖 AI 종합 의견</h2>
            <div className="opinion-box">
              <p className="opinion-desc">{data.최종판단.사용자에게보여줄설명}</p>
              
              {data.최종판단.추가로필요한자료?.length > 0 && (
                <div className="needed-docs">
                  <h4>⚠️ 추가로 필요한 자료</h4>
                  <ul>
                    {data.최종판단.추가로필요한자료.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="warning-text">※ {data.최종판단.주의문구}</p>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

export default ResultPage;