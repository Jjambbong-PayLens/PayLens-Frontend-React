import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PreAnalysisPage() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });

  const questionData = [
    {
      id: 'q1',
      num: 1,
      title: '상시 근로자 수 5인 이상입니까?',
      info: '법적 기준: "예" 선택 시 연장·야간·휴일근로 가산수당(1.5배) 로직이 활성화됩니다.',
      yesText: '네 (5인 이상)',
      noText: '아니오 (5인 미만)',
    },
    {
      id: 'q2',
      num: 2,
      title: '1주 소정근로시간이 15시간 이상입니까?',
      info: '법적 기준: "예" 선택 시 주휴수당 발생 조건이 충족되어 계산에 포함됩니다.',
      yesText: '네 (15시간 이상)',
      noText: '아니오 (15시간 미만)',
    },
    {
      id: 'q3',
      num: 3,
      title: '계속근로기간이 1년 이상입니까?',
      info: '법적 기준: "예" 선택 시 퇴직금 계산 로직이 활성화됩니다.',
      yesText: '네 (1년 이상)',
      noText: '아니오 (1년 미만)',
    },
    {
      id: 'q4',
      num: 4,
      title: '회사 사정으로 예상치 못하게 쉬었던 날이 있습니까?',
      info: '법적 기준: "예" 선택 시 휴업수당(평균임금의 70%) 청구 가능성이 검토됩니다.',
      yesText: '네 (휴업 경험 있음)',
      noText: '아니오 (없음)',
    },
  ];

  const handleAnswer = (questionId, answerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue,
    }));
  };

  const handleNextStep = () => {
    const isAllAnswered = Object.values(answers).every((val) => val !== null);
    
    if (!isAllAnswered) {
      alert('정확한 분석을 위해 모든 항목에 답변해 주세요.');
      return;
    }

    navigate('/analysis', { state: { preAnswers: answers } });
  };

  return (
    <main className="page pre-analysis-page">
      <header className="pre-header">
        <h1>AI 사전 분석 질문</h1>
        <p>정확한 임금 체불 검토를 위해 아래 4가지 항목에 답해주세요. 답변에 따라 적용되는 법적 기준이 달라집니다.</p>
      </header>

      <section className="question-list">
        {questionData.map((q) => (
          <div key={q.id} className="question-card">
            <div className="question-title-area">
              <span className="question-num">{q.num}</span>
              <h3 className="question-title">{q.title}</h3>
            </div>
            
            <div className="question-info">
              <p>{q.info}</p>
            </div>

            <div className="answer-buttons">
              <button
                type="button"
                className={`answer-btn ${answers[q.id] === true ? 'active' : ''}`}
                onClick={() => handleAnswer(q.id, true)}
              >
                {q.yesText}
              </button>
              <button
                type="button"
                className={`answer-btn ${answers[q.id] === false ? 'active' : ''}`}
                onClick={() => handleAnswer(q.id, false)}
              >
                {q.noText}
              </button>
            </div>
          </div>
        ))}
      </section>

      <div className="bottom-action">
        <button type="button" className="submit-btn" onClick={handleNextStep}>
          문서 업로드 단계로
        </button>
      </div>
    </main>
  );
}

export default PreAnalysisPage;