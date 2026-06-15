import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  processDocumentsUpToCrossCheck,
  analyzeDocumentFinal,
  getAnalysisResult,
} from "../utils/documentApi";

function unwrapApiResult(value) {
  let current = value;

  for (let i = 0; i < 5; i++) {
    if (!current || typeof current !== "object") return current;

    if (current.analysisId || current.status || current.documentIds) {
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

function AnalysisPage() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { t } = useTranslation();

  const processFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(
        (file) => file.type === "application/pdf" || file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      alert("PDF 또는 이미지 파일(JPG, PNG, WEBP 등)만 업로드할 수 있습니다.");
    }

    if (validFiles.length > 10) {
      alert(t("AnalysisPage_alert_max_files"));
      return;
    }

    setFiles(validFiles);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    processFiles(selectedFiles);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files || []);
    processFiles(droppedFiles);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert(t("AnalysisPage_alert_no_file"));
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("문서를 업로드하고 OCR을 처리하고 있습니다...");

      const rawCrossCheckResult = await processDocumentsUpToCrossCheck(files);
      const crossCheckResult = unwrapApiResult(rawCrossCheckResult);

      const analysisId = crossCheckResult?.analysisId;
      const status = crossCheckResult?.status;
      const documentIds = crossCheckResult?.documentIds || [];

      if (!analysisId) {
        throw new Error("analysisId를 찾을 수 없습니다.");
      }

      if (
          status === "READY_FOR_ANALYSIS" ||
          crossCheckResult?.autoAnalysisAvailable === true
      ) {
        setLoadingMessage("임금 이상을 탐지 중입니다...");
        await analyzeDocumentFinal(analysisId);

        setLoadingMessage("분석 결과를 불러오는 중입니다...");
        const analysisData = await getAnalysisResult(analysisId);

        navigate("/result", {
          state: {
            documentIds,
            analysisResult: analysisData,
          },
        });

        return;
      }

      if (
          status === "USER_REVIEW_REQUIRED" ||
          crossCheckResult?.userReviewRequired === true
      ) {
        navigate(`/review/${analysisId}`, {
          state: {
            analysisId,
            documentIds,
          },
        });

        return;
      }

      throw new Error(`알 수 없는 분석 상태입니다: ${status || "상태 없음"}`);
    } catch (error) {
      console.error("분석 처리 실패:", error);
      alert(error.message || t("AnalysisPage_alert_error"));
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
      <main className="page">
        <section className="card upload-container">
          <p className="eyebrow">analyse</p>

          <h2>{t("AnalysisPage_h2")}</h2>
          <p>{t("AnalysisPage_description")}</p>

          <div
              className={`dropzone ${isDragging ? "active" : ""}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
          >
            <input
                type="file"
                accept="application/pdf, image/jpeg, image/png, image/webp"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <div className="dropzone-content">
              <p className="main-text">
                {t("AnalysisPage_dropzone_main")} (PDF, 이미지 지원)
              </p>
              <p className="sub-text">{t("AnalysisPage_dropzone_sub")}</p>

              <button type="button" className="select-btn" onClick={onButtonClick}>
                {t("AnalysisPage_btn_select")}
              </button>
            </div>
          </div>

          {files.length > 0 && (
              <ul className="file-list">
                {files.map((file, index) => (
                    <li key={`${file.name}-${index}`}>
                      <span>{file.name}</span>

                      <button type="button" onClick={() => handleRemoveFile(index)}>
                        {t("AnalysisPage_btn_delete")}
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
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                backgroundColor: loading || files.length === 0 ? "#94A3B8" : "#1E1B4B",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
              }}
          >
            {loading
                ? loadingMessage || t("AnalysisPage_btn_analyzing")
                : t("AnalysisPage_btn_start")}
          </button>
        </section>
      </main>
  );
}

export default AnalysisPage;