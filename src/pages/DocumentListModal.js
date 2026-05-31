import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function DocumentListModal({ isOpen, onClose, documents, onDeleteDoc }) {
  const { t } = useTranslation();

  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  useEffect(() => {
    if (isOpen) {
      setSearchName('');
      setSearchDate('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchName = doc.fileName.toLowerCase().includes(searchName.toLowerCase());
      
      let matchDate = true;
      if (searchDate) {
        const docDateObj = new Date(doc.createdAt);
        const docYear = docDateObj.getFullYear();
        const docMonth = String(docDateObj.getMonth() + 1).padStart(2, '0');
        const docDay = String(docDateObj.getDate()).padStart(2, '0');
        const docDateString = `${docYear}-${docMonth}-${docDay}`;
        
        matchDate = docDateString === searchDate;
      }

      return matchName && matchDate;
    });
  }, [documents, searchName, searchDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchDate]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const currentDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      animation: 'fadeIn 0.25s ease-out'
    }} onClick={onClose}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .page-btn {
          width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0;
          background: white; cursor: pointer; display: flex; justify-content: center; align-items: center;
          font-size: 14px; font-weight: 600; color: #475569; transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .page-btn.active { background: #0f172a; color: white; border-color: #0f172a; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
      
      <section style={{ 
        maxWidth: '900px', width: '90%', maxHeight: '85vh', padding: '32px', 
        backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', 
        boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
      }} onClick={(e) => e.stopPropagation()}> 
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '24px', right: '24px',
          border: 'none', background: 'none', fontSize: '20px', color: '#94a3b8', cursor: 'pointer'
        }}>✕</button>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0' }}>
            {t('MyPage_doc_title')}
          </h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder={t('MyPage_search_name_placeholder', '문서명 검색')}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', flex: 1, minWidth: '200px' }}
            />
            <input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', color: '#475569' }}
            />
            <button onClick={() => { setSearchName(''); setSearchDate(''); }} style={{
              padding: '0 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
            }}>
              {t('MyPage_btn_reset', '초기화')}
            </button>
          </div>
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          <table className="mypage-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #edf2f7' }}>
                <th style={{ padding: '12px 8px' }}>{t('MyPage_th_filename')}</th>
                <th style={{ padding: '12px 8px' }}>{t('MyPage_th_analysis_date')}</th>
                <th style={{ padding: '12px 8px' }}>{t('MyPage_th_file_type')}</th>
                <th style={{ padding: '12px 8px' }}>{t('MyPage_th_status')}</th>
                <th style={{ padding: '12px 8px' }}>{t('MyPage_th_manage')}</th> 
              </tr>
            </thead>
            <tbody>
              {currentDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    {t('MyPage_msg_no_docs_search', '조건에 맞는 문서가 없습니다.')}
                  </td>
                </tr>
              ) : (
                currentDocs.map(doc => (
                  <tr key={doc.documentId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 8px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.fileName}
                    </td>
                    <td style={{ padding: '14px 8px', color: '#475569' }}>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 8px', color: '#475569' }}>
                      {doc.contentType && doc.contentType.includes('pdf') ? t('MyPage_type_pdf') : doc.contentType && doc.contentType.includes('image') ? t('MyPage_type_image') : t('MyPage_type_other')}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <span className={`status-badge ${doc.status === 'UPLOADED' ? 'completed' : 'analyzing'}`} style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold',
                        backgroundColor: doc.status === 'UPLOADED' ? '#e6f4ea' : '#fff3e0',
                        color: doc.status === 'UPLOADED' ? '#1e8e3e' : '#f29900'
                      }}>
                        {doc.status === 'UPLOADED' ? t('MyPage_status_completed') : t('MyPage_status_analyzing')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <button className="danger-btn" style={{ 
                        padding: '4px 12px', fontSize: '12px', color: '#dc3545', border: '1px solid #dc3545', 
                        background: 'white', borderRadius: '4px', cursor: 'pointer'
                      }} onClick={() => onDeleteDoc(doc.documentId)}>
                        {t('MyPage_btn_delete')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ width: '80px' }}></div>
          
          {filteredDocs.length > 0 && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                &lt;&lt;
              </button>
              <button className="page-btn" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                &lt;
              </button>
              
              {pages.map(page => (
                <button 
                  key={page} 
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button className="page-btn" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                &gt;
              </button>
              <button className="page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                &gt;&gt;
              </button>
            </div>
          )}

          <div style={{ width: '80px', textAlign: 'right' }}>
            <button onClick={onClose} style={{
              padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#475569',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              {t('MyPage_btn_close')}
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}

export default DocumentListModal;