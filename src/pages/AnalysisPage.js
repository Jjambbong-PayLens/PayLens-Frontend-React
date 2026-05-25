import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndAnalyzeDocumentsTogether } from "../utils/documentApi";

function AnalysisPage() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (selectedFiles) => {
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== selectedFiles.length) {
      alert("PDF 파일만 업로드할 수 있습니다.");
    }

    if (pdfFiles.length > 10) {
      alert("최대 10개 문서까지만 업로드할 수 있습니다.");
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
      alert("분석할 PDF 파일을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      const result = await uploadAndAnalyzeDocumentsTogether(files);

      navigate("/result", {
        state: {
          documentIds: result.documentIds,
          analysisResult: result.analysisResult,
        },
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "문서 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card upload-container">      
        <p className="eyebrow">analyse</p>
        <h2>문서 업로드</h2>
        <p>급여명세서, 공제내역서 등 PDF 문서를 업로드하면 AI가 통합 분석합니다.</p>
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
            <p className="main-text">여기로 파일을 드래그하세요</p>
            <p className="sub-text">또는 클릭하여 급여 명세서(PDF)를 선택하세요</p>
            <button type="button" className="select-btn" onClick={onButtonClick}>
              파일 선택하기
            </button>
          </div>
        </div>

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span>{file.name}</span>
                <button type="button" onClick={() => handleRemoveFile(index)}>
                  삭제
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
          style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: loading || files.length === 0 ? '#94A3B8' : '#1E1B4B', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading || files.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "분석 중..." : "분석 시작"}
        </button>
      </section>
    </main>
  );
}

export default AnalysisPage;