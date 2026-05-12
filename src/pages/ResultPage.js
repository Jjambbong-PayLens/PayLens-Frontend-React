import { useLocation, Navigate } from "react-router-dom";

function safeParseJson(value) {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

function ResultPage() {
  const location = useLocation();

  const documentIds = location.state?.documentIds;
  const rawAnalysisResult = location.state?.analysisResult;

  if (!rawAnalysisResult) {
    return <Navigate to="/analysis" replace />;
  }

  const analysisResult = safeParseJson(rawAnalysisResult);

  return (
      <main className="page">
        <section className="card">
          <h1>AI 분석 결과</h1>

          {documentIds && (
              <p>분석 문서 ID: {documentIds.join(", ")}</p>
          )}

          {typeof analysisResult === "string" ? (
              <pre>{analysisResult}</pre>
          ) : (
              <>
                <h2>요약</h2>
                <p>{analysisResult.summary || "요약 정보가 없습니다."}</p>

                <h2>분석 JSON</h2>
                <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
              </>
          )}
        </section>
      </main>
  );
}

export default ResultPage;