import api from './api';

export async function loginWithProvider(provider, code) {
  const path = provider === 'google' ? '/api/auth/google' : '/api/auth/kakao';
  const response = await api.post(path, { code });
  return response.data;
}

export async function logoutUser() {
  const response = await api.post('/api/auth/logout');
  return response.data;
}

export async function reissueAccessToken() {
  const response = await api.post('/api/auth/reissue');
  return response.data;
}

export async function withdrawUser() {
  const response = await api.delete('/api/auth/withdraw');
  return response.data;
}