function ResultPage() {
  return (
    <section className="page-card">
      <p className="eyebrow">Result</p>
      <h2>분석 결과</h2>
      <div className="result-grid">
        <article>
          <strong>상태</strong>
          <span className="badge warning">확인 필요</span>
        </article>
        <article>
          <strong>예상 미지급액</strong>
          <p>로그인/분석 API 연결 후 실제 값 표시</p>
        </article>
        <article>
          <strong>PDF 리포트</strong>
          <p>결제 또는 리포트 API 연결 예정</p>
        </article>
      </div>
    </section>
  );
}

export default ResultPage;
