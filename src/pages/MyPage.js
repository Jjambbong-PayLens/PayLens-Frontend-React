import { getUser } from '../utils/auth';

function MyPage() {
  const user = getUser();

  return (
    <section className="page-card">
      <p className="eyebrow">My Page</p>
      <h2>내 정보</h2>
      <dl className="info-list">
        <dt>이름</dt>
        <dd>{user?.username || '-'}</dd>
        <dt>역할</dt>
        <dd>{user?.role || '-'}</dd>
        <dt>Provider ID</dt>
        <dd>{user?.providerId || '-'}</dd>
      </dl>
    </section>
  );
}

export default MyPage;
