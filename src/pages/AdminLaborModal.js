import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPendingLabors, approveLaborRole, rejectLaborRole } from '../utils/documentApi'; 

function AdminLaborModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [pendingList, setPendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 대기 중(PENDING)인 노무사 신청 목록 불러오기
  const fetchPendingList = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingLabors(); 
      setPendingList(data || []);
    } catch (error) {
      console.error("대기 목록 조회 실패:", error);
      alert(error.message || t('AdminModal_msg_error', '대기 목록을 불러오는 중 오류가 발생했습니다.')); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPendingList();
    }
  }, [isOpen]);

  // 🚀 승인 API 연동
  const handleApprove = async (userId) => {
    if (!window.confirm(t('AdminModal_confirm_approve', '해당 유저의 노무사 권한을 승인하시겠습니까?'))) return;
    try {
      await approveLaborRole(userId); 
      alert(t('AdminModal_alert_approve_success', '승인되었습니다.'));
      setPendingList(prev => prev.filter(user => user.userId !== userId));
    } catch (error) {
      alert(error.message || t('AdminModal_alert_approve_fail', '승인 처리에 실패했습니다.'));
    }
  };

  // 🚀 거절 API 연동
  const handleReject = async (userId) => {
    if (!window.confirm(t('AdminModal_confirm_reject', '해당 유저의 노무사 권한을 거절하시겠습니까?'))) return;
    try {
      await rejectLaborRole(userId); 
      alert(t('AdminModal_alert_reject_success', '거절되었습니다.'));
      setPendingList(prev => prev.filter(user => user.userId !== userId));
    } catch (error) {
      alert(error.message || t('AdminModal_alert_reject_fail', '거절 처리에 실패했습니다.'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-box" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: '#1e293b', margin: 0, fontSize: '20px' }}>
            👑 {t('AdminModal_title', '노무사 가입 승인 대기 목록')}
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '20px' }}>
          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>{t('AdminModal_msg_loading', '목록을 불러오는 중입니다...')}</p>
          ) : pendingList.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>{t('AdminModal_msg_empty', '대기 중인 노무사 신청이 없습니다.')}</p>
          ) : (
            <table className="mypage-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>{t('AdminModal_th_id', '유저 ID')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>{t('AdminModal_th_name', '이름')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>{t('AdminModal_th_date', '신청 일자')}</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{t('AdminModal_th_manage', '관리')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map(item => (
                  <tr key={item.userId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', color: '#1e293b', fontWeight: '500' }}>{item.userId}</td>
                    <td style={{ padding: '12px', color: '#334155' }}>{item.username}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>
                      {new Date(item.appliedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => window.open(item.certificateUrl, '_blank')}
                      >
                        {t('AdminModal_btn_doc', '서류 확인')}
                      </button>
                      <button 
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => handleApprove(item.userId)}
                      >
                        {t('AdminModal_btn_approve', '승인')}
                      </button>
                      <button 
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => handleReject(item.userId)}
                      >
                        {t('AdminModal_btn_reject', '거절')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLaborModal;