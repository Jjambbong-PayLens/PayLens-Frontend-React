import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUser } from '../utils/auth';
import { preparePayment, verifyPayment } from '../utils/paymentApi';

function PaymentPage() {
  const { t } = useTranslation();
  const user = getUser();
  const [amount, setAmount] = useState(5000);
  const [impUid, setImpUid] = useState('');
  const [merchantUid, setMerchantUid] = useState('');
  const [message, setMessage] = useState('');

  const handlePrepare = async () => {
    try {
      setMessage('결제 준비 중입니다...');
      const response = await preparePayment({
        userId: user?.id,
        amount: Number(amount),
      });
      setMerchantUid(response?.result?.merchantUid || response?.merchantUid || '');
      setMessage('결제 준비 완료');
    } catch (error) {
      console.error('결제 준비 실패:', error);
      setMessage(error.message || '결제 준비에 실패했습니다.');
    }
  };

  const handleVerify = async () => {
    try {
      setMessage('결제 검증 중입니다...');
      const response = await verifyPayment({
        impUid,
        merchantUid,
      });
      setMessage(response?.message || '결제 검증 완료');
    } catch (error) {
      console.error('결제 검증 실패:', error);
      setMessage(error.message || '결제 검증에 실패했습니다.');
    }
  };
  
  return (
    <section className="page-card">
      <p className="eyebrow">Payment</p>
      <h2>{t('PaymentPage_title')}</h2>
      <p>{t('PaymentPage_desc')}</p>
      <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
        <label>
          결제 금액
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', width: '100%', marginTop: '6px' }} />
        </label>
        <button type="button" className="primary-button" onClick={handlePrepare}>{t('PaymentPage_button')}</button>
        <label>
          impUid
          <input type="text" value={impUid} onChange={(e) => setImpUid(e.target.value)} style={{ display: 'block', width: '100%', marginTop: '6px' }} />
        </label>
        <label>
          merchantUid
          <input type="text" value={merchantUid} onChange={(e) => setMerchantUid(e.target.value)} style={{ display: 'block', width: '100%', marginTop: '6px' }} />
        </label>
        <button type="button" className="primary-button" onClick={handleVerify}>결제 검증</button>
        {message && <p>{message}</p>}
      </div>
    </section>
  );
}

export default PaymentPage;
