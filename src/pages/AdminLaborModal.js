import React, { useState, useEffect } from 'react';
import { approveLaborRole, rejectLaborRole, getPendingLabors } from '../utils/documentApi';

function AdminLaborModal({ isOpen, onClose }) {
  const [pendingList, setPendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const adminButtonStyle = {
    width: '88px',
    height: '36px',
    padding: '0 10px',
    fontSize: '13px',
    fontWeight: '600',
  };

  const fetchPendingList = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingLabors();
      setPendingList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('대기 목록 조회 실패:', error);
      alert(error.message || '대기 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchPendingList();
  }, [isOpen]);

  const handleApprove = async (userId) => {
    if (!window.confirm('해당 유저의 노무사 권한을 승인하시겠습니까?')) return;
    try {
      await approveLaborRole(userId);
      setPendingList((prev) => prev.filter((u) => (u.userId ?? u.id ?? u.user?.id) !== userId));
    } catch (error) {
      console.error(error);
      alert(error.message || '승인 처리에 실패했습니다.');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('해당 유저의 노무사 권한을 거절하시겠습니까?')) return;
    try {
      await rejectLaborRole(userId);
      setPendingList((prev) => prev.filter((u) => (u.userId ?? u.id ?? u.user?.id) !== userId));
    } catch (error) {
      console.error(error);
      alert(error.message || '거절 처리에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: '#1e293b', margin: 0, fontSize: '20px' }}>👑 노무사 대기 관리</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '12px', padding: '12px' }}>
          {isLoading && <div style={{ padding: '12px', color: '#334155' }}>로딩 중...</div>}

          {!isLoading && (!pendingList || pendingList.length === 0) && (
            <div style={{ padding: '12px', color: '#64748b' }}>대기 중인 신청이 없습니다.</div>
          )}

          {!isLoading && pendingList && pendingList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingList.map((user) => {
                const id = user?.userId ?? user?.id ?? user?.user?.id;
                const displayName = user?.name || user?.user?.name || user?.userName || '이름 없음';

                return (
                  <div key={id || Math.random()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #eef2ff', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{displayName}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>ID: {id ?? '-'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="edit-btn" style={adminButtonStyle} onClick={() => handleApprove(id)}>승인</button>
                      <button className="danger-btn" style={adminButtonStyle} onClick={() => handleReject(id)}>거절</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLaborModal;