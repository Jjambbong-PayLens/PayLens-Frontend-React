import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function safeParseJson(value) {
  if (!value) return null;
  let targetValue = value;
  if (typeof value === "object" && value.result) targetValue = value.result;
  if (typeof targetValue === "object") return targetValue;
  
  let cleanValue = targetValue;
  if (typeof targetValue === "string") {
    cleanValue = targetValue.replace(/```json/gi, "").replace(/```/g, "").trim();
  }
  try {
    return JSON.parse(cleanValue);
  } catch (error) {
    return targetValue;
  }
}

function ResultPage() {
  const { analysisId } = useParams();
  const location = useLocation();
  const pdfRef = useRef();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(!location.state?.analysisResult);
  const [rawAnalysisResult, setRawAnalysisResult] = useState(location.state?.analysisResult || null);

  const [selectedKey] = useState(null);  

  useEffect(() => {
    if (rawAnalysisResult) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      if (!analysisId) { setLoading(false); return; }
      try {
        const response = await api.get(`/api/analyses/${analysisId}`);
        const resData = response.data.result;
        if (resData) {
          if (typeof resData === 'string') setRawAnalysisResult(resData);
          else if (resData.result) setRawAnalysisResult(resData.result);
          else setRawAnalysisResult(JSON.stringify(resData));
        }
      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [analysisId, rawAnalysisResult]);

  if (loading) return <div>{t('ResultPage_loading', '분석 결과를 불러오는 중입니다...')}</div>;

  const data = safeParseJson(rawAnalysisResult);
  if (!rawAnalysisResult || !data) return <Navigate to="/analysis" replace/>;

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
    if (s.includes("낮음") || s.includes("low") || s.includes("safe")) return "badge-safe";
    if (s.includes("높음") || s.includes("high") || s.includes("risk")) return "badge-danger";
    return "badge-warning";
  };

  const titleMap = {
    "최저임금및주휴수당": t('ResultPage_map_minimum_wage'),
    "퇴직금미지급": t('ResultPage_map_severance_pay'),
    "야간근로수당및휴업수당": t('ResultPage_map_night_shift'),
    "초과근로수당휴일근로수당연차수당": t('ResultPage_map_overtime')
  };

  return (
    <main className="page" style={{ display: 'flex', gap: '24px', padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .evidence-animate-fade { animation: fadeInUp 0.3s ease-out forwards; }
        
        .citation-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 6px;
          padding: 0 5px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          background-color: #f1f5f9;
          border-radius: 4px;
          cursor: help;
          vertical-align: super;
          border: 1px solid #e2e8f0;
          user-select: none;
          transition: all 0.2s ease;
        }
        .citation-badge:hover {
          background-color: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
        }
      `}</style>
      
      <div className="result-container" ref={pdfRef} style={{ flex: 1.2, background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <header className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>{t('ResultPage_h1_detail')}</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              {data.문서요약?.확인된기간} {data.문서요약?.사업장명} {t('ResultPage_subtitle_analysis')}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <button className="pdf-btn" onClick={handleDownloadPdf} style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {t('ResultPage_btn_pdf')}
            </button>
            <span className={`status-badge ${getBadgeClass(data.최종판단?.임금체불가능성)}`}>
              {data.최종판단?.임금체불가능성?.split(" ")[0] || t('ResultPage_status_unknown')}
            </span>
          </div>
        </header>

        <div className="summary-grid" style={{ marginBottom: '24px' }}>
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
              <li><span>{t('ResultPage_doc_validity')}</span> <strong>{data.문서검증?.문서적합도 || "-"}</strong></li>
              <li><span>{t('ResultPage_pay_date')}</span> <strong>{data.공통추출항목?.급여지급일 || "-"}</strong></li>
            </ul>
          </div>
        </div>

        {data.임금체불분석 && Object.keys(data.임금체불분석).length > 0 && (
          <section className="detail-section" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>{t('ResultPage_detail_analysis')}</h2>
            <div className="analysis-list">
              {Object.entries(data.임금체불분석).map(([key, value]) => {
                const displayTitle = titleMap[key] || key;
                const isSelected = selectedKey === key;
                return (
                  <div 
                    className="analysis-item" 
                    key={key} 
                    style={{ 
                      padding: '16px', 
                      border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: isSelected ? '#f8fafc' : 'transparent',
                      boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.05)' : 'none'
                    }}
                  >
                    <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: isSelected ? '#4f46e5' : '#0f172a', fontWeight: isSelected ? '700' : '600' }}>{displayTitle}</h4>
                      <span className={`small-badge ${getBadgeClass(value.위반가능성 || value.미지급가능성)}`}>
                        {value.위반가능성 || value.미지급가능성 || t('ResultPage_judgment_unknown')}
                      </span>
                    </div>
                    <p className="item-reason" style={{ margin: 0, fontSize: '14px', color: '#475569' }}>{value.판단근거?.[0] || t('ResultPage_no_reason')}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {data.최종판단 && (
          <section className="ai-opinion-section">
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>🤖 {t('ResultPage_ai_opinion')}</h2>
            <div className="opinion-box" style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p className="opinion-desc" style={{ margin: '0 0 16px 0', lineHeight: '1.6' }}>{data.최종판단.사용자에게보여줄설명}</p>
              {data.최종판단.추가로필요한자료?.length > 0 && (
                <div className="needed-docs" style={{ marginBottom: '16px', padding: '14px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#e65100', fontSize: '14px' }}>⚠️ {t('ResultPage_needed_docs')}</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#e65100' }}>
                    {data.최종판단.추가로필요한자료.map((doc, idx) => <li key={idx}>{doc}</li>)}
                  </ul>
                </div>
              )}
              <p className="warning-text" style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>※ {data.최종판단.주의문구}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ResultPage;