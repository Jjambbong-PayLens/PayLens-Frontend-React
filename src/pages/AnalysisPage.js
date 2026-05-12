import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AnalysisPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/loading');
  };

  return (
    <section className="page-card">
      <p className="eyebrow">Analysis</p>
      <h2>임금 분석 자료 업로드</h2>
      <p>현재는 화면 전환용 기본 UI입니다. 실제 PDF 업로드 API가 정해지면 이 페이지에 연결하면 됩니다.</p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          급여명세서 파일
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(event) => setFileName(event.target.files?.[0]?.name || '')}
          />
        </label>

        {fileName && <p className="status-message">선택된 파일: {fileName}</p>}

        <button type="submit" className="primary-button">분석 요청</button>
      </form>
    </section>
  );
}

export default AnalysisPage;
