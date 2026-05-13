import React, { useState } from 'react';
import { getUser } from '../utils/auth';

function MyPage() {
  // 실제로는 백엔드에서 가져올 가상 데이터입니다.
  const [userInfo] = useState({
    username: '한수민',
    email: 'sumin.han@example.com',
    phone: '010-1234-5678',
    language: '한국어 (Korean)'
  });
  const user = getUser();
  
  return (
    <main className="page mypage-container">
      {/* 헤더 부분 */}
      <header className="mypage-header">
        <h1>마이페이지</h1>
        <p>계정 설정, 결제 내역 및 문서를 관리하세요.</p>
      </header>

      {/* 섹션 1: 프로필 개요 (이미지 제외) */}
      <section className="card profile-section">
        <div className="section-header">
          <h3>프로필 개요</h3>
        </div>
        <div className="profile-grid">
          <div className="info-group">
            <label>이름</label>
            <p>{user?.username || '사용자'}</p>
          </div>
          <div className="info-group">
            <label>언어 설정</label>
            <p>{userInfo.language}</p>
          </div>
        </div>
      </section>

      {/* 섹션 2: 결제 내역 및 영수증 */}
      <section className="card table-section">
        <div className="section-header">
          <h3>결제 내역 및 영수증</h3>
          <button className="more-btn">더보기</button>
        </div>
        <table className="mypage-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>내역</th>
              <th>금액</th>
              <th>상태</th>
              <th>항목</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </section>

      {/* 섹션 3: 문서 보관함 */}
      <section className="card table-section">
        <div className="section-header">
          <h3>문서 보관함</h3>
          <button className="more-btn">더보기</button>
        </div>
        <table className="mypage-table">
          <thead>
            <tr>
              <th>파일명</th>
              <th>분석 일자</th>
              <th>유형</th>
              <th>결과</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </section>

      {/* 섹션 4: 계정 관리 및 보안 (새로 추가됨) */}
      <section className="card security-section">
        <div className="section-header">
          <h3>계정 관리 및 보안</h3>
        </div>
        <div className="security-list">
          <div className="security-item">
            <div>
              <strong>비밀번호 변경</strong>
              <p>마지막 변경: 3개월 전</p>
            </div>
            <button className="outline-btn">변경하기</button>
          </div>
          <div className="security-item">
            <div>
              <strong>2단계 인증</strong>
              <p>계정을 더욱 안전하게 보호하세요.</p>
            </div>
            <button className="outline-btn">설정</button>
          </div>
          <div className="security-item danger">
            <div>
              <strong>회원 탈퇴</strong>
              <p>계정 및 모든 데이터를 영구적으로 삭제합니다.</p>
            </div>
            <button className="outline-btn">탈퇴하기</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyPage;