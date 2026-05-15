import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

function PreAnalysisPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      title: t('PreAnalysisPage_q1_title'),
      info: t('PreAnalysisPage_q1_info'),
      yesText: t('PreAnalysisPage_q1_yes'),
      noText: t('PreAnalysisPage_q1_no'),
    },
    {
      id: 'q2',
      num: 2,
      title: t('PreAnalysisPage_q2_title'),
      info: t('PreAnalysisPage_q2_info'),
      yesText: t('PreAnalysisPage_q2_yes'),
      noText: t('PreAnalysisPage_q2_no'),
    },
    {
      id: 'q3',
      num: 3,
      title: t('PreAnalysisPage_q3_title'),
      info: t('PreAnalysisPage_q3_info'),
      yesText: t('PreAnalysisPage_q3_yes'),
      noText: t('PreAnalysisPage_q3_no'),
    },
    {
      id: 'q4',
      num: 4,
      title: t('PreAnalysisPage_q4_title'),
      info: t('PreAnalysisPage_q4_info'),
      yesText: t('PreAnalysisPage_q4_yes'),
      noText: t('PreAnalysisPage_q4_no'),
    },
  ];

  const handleAnswer = (questionId, answerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue,
    }));
  };

  const handleNextStep = async () => {
    const isAllAnswered = Object.values(answers).every((val) => val !== null);

    if (!isAllAnswered) {
      alert(t('PreAnalysisPage_alert_incomplete'));
      return;
    }

    const surveyRequest = {
      isOverFiveEmployees: answers.q1,
      isWorkingOverFifteenHours: answers.q2,
      isWorkingOverOneYear: answers.q3,
      hasUnscheduledDayOff: answers.q4,
    };

    try {
      await api.post('/api/surveys', surveyRequest);

      navigate('/analysis', {
        state: {
          preAnswers: answers,
        },
      });
    } catch (error) {
      console.error('4대 문진 저장 실패:', error);
      alert(t('PreAnalysisPage_alert_error'));
    }
  };

  return (
    <main className="page pre-analysis-page">
      <header className="pre-header">
        <h1>{t('PreAnalysisPage_h1')}</h1>
        <p>{t('PreAnalysisPage_description')}</p>
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
          {t('PreAnalysisPage_btn_submit')}
        </button>
      </div>
    </main>
  );
}

export default PreAnalysisPage;