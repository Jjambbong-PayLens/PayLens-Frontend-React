import { useTranslation } from 'react-i18next';

function PaymentPage() {
  const { t } = useTranslation();
  
  return (
    <section className="page-card">
      <p className="eyebrow">Payment</p>
      <h2>{t('PaymentPage_title')}</h2>
      <p>{t('PaymentPage_desc')}</p>
      <button type="button" className="primary-button">{t('PaymentPage_button')}</button>
    </section>
  );
}

export default PaymentPage;
