import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { useTranslation } from 'react-i18next';

function DashboardPage() {
  const user = getUser();
  const { t } = useTranslation();

  return (
    <section className="page-card hero-card">
      <p className="eyebrow">Dashboard</p>
      <h2>{user?.username || '사용자'}{t('DashboardPage_user-fallback')}</h2>
      <p>
        {t('DashboardPage_description')}
      </p>
      <div className="button-row">
        <Link className="primary-link" to="/preanalysis">{t('DashboardPage_btn-start')}</Link>
        <Link className="secondary-link" to="/result">{t('DashboardPage_btn-result')}</Link>
      </div>
    </section>
  );
}

export default DashboardPage;