import axios from 'axios';
import { useState } from 'react';

function LanguageSelector() {
  const [language, setLanguage] = useState('KO');

  const changeLanguage = async (newLang) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: 'https://api.paylens.kro.kr/api/user/language',
        data: {
          language: newLang
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // 자물쇠 아이콘(Authorize) 처리를 위한 토큰
        }
      });

      if (response.data.isSuccess) {
        setLanguage(newLang);
        alert('언어가 변경되었습니다!');
      }
    } catch (error) {
      console.error('API 연결 실패:', error);
      alert('언어 변경에 실패했습니다.');
    }
  };

  return (
    <div>
      <p>현재 언어: {language}</p>
      <button onClick={() => changeLanguage('EN')}>영어로 변경</button>
    </div>
  );
}