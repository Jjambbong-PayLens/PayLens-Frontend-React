import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUser } from '../utils/auth';
import api from '../utils/api';

function PaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const { t } = useTranslation();
  const user = getUser();
  
  const [amount] = useState(4900); 
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handlePaymentFlow = async () => {
    try {
      setMessage(t('PaymentPage_msg_preparing'));
      
      const prepareResponse = await api.post('/api/v1/payments/prepare', {
        userId: user?.id || 1,
        amount: amount,
      });
      
      const merchantUid = prepareResponse.data?.result?.merchantUid || prepareResponse.data?.merchantUid;
      
      if (!merchantUid) {
        throw new Error(t('PaymentPage_error_no_merchant_uid'));
      }

      setMessage(t('PaymentPage_msg_opening_pg'));
      const { IMP } = window;
      
      IMP.init('imp88876828'); 

      const paymentData = {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: t('PaymentPage_product_name'),
        amount: amount,
        customer_uid: `billing_${user?.id || 'temp'}_${new Date().getTime()}`, 
      };

      IMP.request_pay(paymentData, async (response) => {
        const { success, imp_uid, merchant_uid, error_msg } = response;

        if (success) {
          setMessage(t('PaymentPage_msg_verifying'));
          try {
            await api.post('/api/v1/payments/verify', {
              impUid: imp_uid,
              merchantUid: merchant_uid,
            });
            setMessage(t('PaymentPage_msg_success'));
            alert(t('PaymentPage_alert_success'));
            
            if (onPaymentSuccess) onPaymentSuccess(); 
            onClose(); 
          } catch (verifyError) {
            console.error('검증 에러:', verifyError);
            setMessage(t('PaymentPage_msg_verify_fail'));
            alert(t('PaymentPage_alert_verify_fail'));
          }
        } else {
          setMessage(t('PaymentPage_msg_cancel_fail'));
          alert(`${t('PaymentPage_alert_cancel_fail')}: ${error_msg}`); 
        }
      });
    } catch (error) {
      console.error('결제 준비 에러:', error);
      setMessage(error.response?.data?.message || error.message || t('PaymentPage_msg_error_default'));
      alert(error.response?.data?.message || t('PaymentPage_alert_prepare_fail'));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.4)', 
      backdropFilter: 'blur(4px)', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.25s ease-out'
    }} onClick={onClose}>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <section style={{ 
        maxWidth: '420px', 
        width: '90%', 
        padding: '40px 32px', 
        backgroundColor: '#ffffff', 
        borderRadius: '20px', 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', 
        boxSizing: 'border-box',
        position: 'relative',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
      }} onClick={(e) => e.stopPropagation()}> 
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            background: 'none',
            fontSize: '20px',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: '#4f46e5', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px', 
            marginBottom: '12px' 
          }}>
            Premium Subscription
          </p>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 10px 0' }}>
            {t('PaymentPage_title')}
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0, lineHeight: '1.6' }}>
            {t('PaymentPage_desc')}
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8fafc', 
          borderRadius: '14px', 
          padding: '24px', 
          marginBottom: '28px',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: '#475569', fontSize: '15px', fontWeight: '500' }}>
              {t('PaymentPage_label_amount')}
            </span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
              {amount.toLocaleString()}<span style={{ fontSize: '16px', fontWeight: '600', color: '#94a3b8', marginLeft: '2px' }}>{t('PaymentPage_label_per_month')}</span>
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>결제 주기</span>
            <span style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>매월 자동결제</span>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={handlePaymentFlow}
          style={{ 
            width: '100%', 
            padding: '16px', 
            fontSize: '16px', 
            fontWeight: '700',
            color: '#ffffff',
            backgroundColor: '#0f172a', 
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(15, 23, 42, 0.15)'
          }}
        >
          {t('PaymentPage_btn_pay')}
        </button>
        
        {message && (
          <p style={{ marginTop: '16px', color: '#4f46e5', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

export default PaymentModal;
