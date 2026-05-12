export function saveAuth(result) {
  localStorage.setItem('accessToken', result.accessToken);
  localStorage.setItem('userId', String(result.id ?? ''));
  localStorage.setItem('providerId', result.providerId ?? '');
  localStorage.setItem('role', result.role ?? '');
  localStorage.setItem('username', result.username ?? '');
  localStorage.setItem('user', JSON.stringify(result));
}

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('providerId');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('user');
}
