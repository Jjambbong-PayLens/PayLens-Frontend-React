import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndAnalyzeDocumentsTogether } from "../utils/documentApi";

function AnalysisPage() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

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
        <section className="card">
          <h1>문서 분석</h1>
          <p>급여명세서, 공제내역서 등 PDF 문서를 업로드하면 AI가 통합 분석합니다.</p>

          <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
          />

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
              type="button"
              onClick={handleAnalyze}
              disabled={loading || files.length === 0}
          >
            {loading ? "분석 중..." : "분석 시작"}
          </button>
        </section>
      </main>
  );
}

export default AnalysisPage;