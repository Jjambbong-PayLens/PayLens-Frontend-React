import api from './api';

export async function preparePayment(payload) {
  const response = await api.post('/api/v1/payments/prepare', payload);
  return response.data;
}

export async function verifyPayment(payload) {
  const response = await api.post('/api/v1/payments/verify', payload);
  return response.data;
}