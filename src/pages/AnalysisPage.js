import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndAnalyzeDocumentsTogether } from "../utils/documentApi";
import { useTranslation } from 'react-i18next';

function AnalysisPage() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [loadingStage, setLoadingStage] = useState(""); 
  
  const [checking, setChecking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const { t } = useTranslation();

  const processFiles = (selectedFiles) => {
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== selectedFiles.length) {
      alert(t('AnalysisPage_alert_only_pdf'));
    }

    if (pdfFiles.length > 10) {
      alert(t('AnalysisPage_alert_max_files'));
      return;
    }

    setFiles(pdfFiles);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    processFiles(selectedFiles);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    processFiles(droppedFiles);
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

const handleAnalyze = async () => {
  if (files.length === 0) {
    alert(t('AnalysisPage_alert_no_file'));
    return;
  }

  const primaryFileName = files[0]?.name || "분석된 원본 문서.pdf";

  try {
    setLoading(true);
    setLoadingStage("ocr");

    const stageTimer = setTimeout(() => {
      setLoadingStage("gemini");
    }, 4500); 

    const result = await uploadAndAnalyzeDocumentsTogether(files);
    clearTimeout(stageTimer);

    console.log("🚀 [AnalysisPage 최종 결과 안착 확인]:", result);

    const targetId = (result.documentIds && result.documentIds.length > 0) ? result.documentIds[0] : 8;

    navigate(`/result/${targetId}`, {
      state: {
        documentIds: result.documentIds || [targetId],
        analysisResult: result.analysisResult,
        fileName: primaryFileName,
      },
    });

  } catch (error) {
    console.error("🚨 분석 프로세스 도중 런타임 예외 감지:", error);
    alert(error.message || t('AnalysisPage_alert_error'));
  } finally {
    setLoading(false);
    setLoadingStage("");
  }
};

  useEffect(() => {
    setChecking(false);
  }, []);

  if (checking) return <div>{t('AnalysisPage_checking', '정보 확인 중...')}</div>;

  return (
    <main className="page">
      <section className="card upload-container">      
        <p className="eyebrow">analyse</p>
        <h2>{t('AnalysisPage_h2')}</h2>
        <p>{t('AnalysisPage_description')}</p>
        <div 
          className={`dropzone ${isDragging ? 'active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} 
          />
          
          <div className="dropzone-content">
            <p className="main-text">{t('AnalysisPage_dropzone_main')}</p>
            <p className="sub-text">{t('AnalysisPage_dropzone_sub')}</p>
            <button type="button" className="select-btn" onClick={onButtonClick}>
              {t('AnalysisPage_btn_select')}
            </button>
          </div>
        </div>

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span>{file.name}</span>
                <button type="button" onClick={() => handleRemoveFile(index)}>
                  {t('AnalysisPage_btn_delete')}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          className="analyze-submit-btn"
          type="button"
          onClick={handleAnalyze}
          disabled={loading || files.length === 0}
          style={{ 
            marginTop: '20px', 
            width: '100%', 
            padding: '12px', 
            backgroundColor: loading || files.length === 0 ? '#94A3B8' : '#1E1B4B', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: loading || files.length === 0 ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? (
            loadingStage === "ocr" 
              ? "원본 문서에서 OCR 추출 중입니다..." 
              : "AI를 통해 임금 체불 리스크를 분석 중입니다..."
          ) : (
            t('AnalysisPage_btn_start')
          )}
        </button>
      </section>
    </main>
  );
}

export default AnalysisPage;