import React, { useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const documentIds = location.state?.documentIds;
  const rawAnalysisResult = location.state?.analysisResult;

  if (!rawAnalysisResult) {
    return <Navigate to="/analysis" replace />;
  }

  const data = safeParseJson(rawAnalysisResult);

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    
    const btn = element.querySelector('.pdf-btn');
    if(btn) btn.style.display = 'none';

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      const fileNamePrefix = t('ResultPage_pdf_prefix');
      const userName = data.문서요약?.근로자명 || t('ResultPage_anonymous');
      pdf.save(`${fileNamePrefix}_${userName}.pdf`);
      
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert(t('ResultPage_alert_pdf_error'));
    } finally {
      if(btn) btn.style.display = 'block';
    }
  };

  if (typeof data === "string") {
    return (
      <main className="page">
        <section className="result-container" ref={pdfRef}>
          <header className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>{t('ResultPage_h1_fallback')}</h1>
            <button className="pdf-btn" onClick={handleDownloadPdf} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {t('ResultPage_btn_pdf')}
            </button>
          </header>
          <pre>{data}</pre>
        </section>
      </main>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return `- ${t('ResultPage_currency_unit')}`;
    return amount.toLocaleString() + t('ResultPage_currency_unit');
  };

const getBadgeClass = (status) => {
    if (!status) return "badge-neutral";
    
    const s = status.toLowerCase();

    if (s.includes("낮음") || s.includes("low") || s.includes("thấp") || s.includes("safe")) {
      return "badge-safe";
    }
    if (s.includes("높음")  || s.includes("high") || s.includes("risk") || s.includes("cao")) {
      return "badge-danger";
    }
    if (s.includes("추가자료필요") || s.includes("need") || s.includes("warning") || 
        s.includes("cần") || s.includes("trung bình") || s.includes("xác nhận") || s.includes("undetermined")) {
      return "badge-warning";
    }
    return "badge-neutral";
  };

  const titleMap = {
    "최저임금및주휴수당": t('ResultPage_map_minimum_wage'),
    "퇴직금미지급": t('ResultPage_map_severance_pay'),
    "야간근로수당및휴업수당": t('ResultPage_map_night_shift'),
    "초과근로수당휴일근로수당연차수당": t('ResultPage_map_overtime')
  };

  return (
    <main className="page">
      <div className="result-container" ref={pdfRef} style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        
        <header className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>{t('ResultPage_h1_detail')}</h1>
            <p>
              {data.문서요약?.확인된기간} {data.문서요약?.사업장명} {t('ResultPage_subtitle_analysis')}
              {documentIds && <span style={{fontSize: '12px', color: '#94a3b8', marginLeft: '10px'}}> ({t('ResultPage_doc_id')}: {documentIds.join(", ")})</span>}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <button className="pdf-btn" onClick={handleDownloadPdf} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {t('ResultPage_btn_pdf')}
            </button>
            <span className={`status-badge ${getBadgeClass(data.최종판단?.임금체불가능성)}`}>
              {data.최종판단?.임금체불가능성?.split(" ")[0] || t('ResultPage_status_unknown')}
            </span>
          </div>
        </header>

        <div className="summary-grid">
          <div className="summary-card">
            <h3>{t('ResultPage_summary_salary')}</h3>
            <div className="amount-row">
              <span>{t('ResultPage_total_payment')}</span>
              <strong>{formatCurrency(data.공통추출항목?.총지급액)}</strong>
            </div>
            <div className="amount-row highlight">
              <span>{t('ResultPage_net_pay')}</span>
              <strong>{formatCurrency(data.공통추출항목?.실수령액)}</strong>
            </div>
            <div className="amount-row muted">
              <span>{t('ResultPage_deduction')}</span>
              <span>{formatCurrency(data.공통추출항목?.총공제액)}</span>
            </div>
          </div>

          <div className="summary-card">
            <h3>{t('ResultPage_doc_info')}</h3>
            <ul className="info-list">
              <li><span>{t('ResultPage_worker_name')}</span> <strong>{data.문서요약?.근로자명 || "-"}</strong></li>
              <li><span>{t('ResultPage_doc_type')}</span> <strong>{data.문서요약?.문서유형 || "-"}</strong></li>
              <li>
                <span>{t('ResultPage_doc_validity')}</span> 
                <strong>{data.문서검증?.문서적합도 || "-"}</strong>
              </li>
              <li><span>{t('ResultPage_pay_date')}</span> <strong>{data.공통추출항목?.급여지급일 || "-"}</strong></li>
            </ul>
          </div>
        </div>

        {data.임금체불분석 && Object.keys(data.임금체불분석).length > 0 && (
          <section className="detail-section">
            <h2>{t('ResultPage_detail_analysis')}</h2>
            <div className="analysis-list">
              {Object.entries(data.임금체불분석).map(([key, value]) => (
                <div className="analysis-item" key={key}>
                  <div className="item-header">
                    <h4>{titleMap[key] || key}</h4>
                    <span className={`small-badge ${getBadgeClass(value.위반가능성 || value.미지급가능성)}`}>
                      {value.위반가능성 || value.미지급가능성 || t('ResultPage_judgment_unknown')}
                    </span>
                  </div>
                  <p className="item-reason">{value.판단근거?.[0] || t('ResultPage_no_reason')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.최종판단 && (
          <section className="ai-opinion-section">
            <h2>🤖 {t('ResultPage_ai_opinion')}</h2>
            <div className="opinion-box">
              <p className="opinion-desc">{data.최종판단.사용자에게보여줄설명}</p>
              
              {data.최종판단.추가로필요한자료?.length > 0 && (
                <div className="needed-docs">
                  <h4>⚠️ {t('ResultPage_needed_docs')}</h4>
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