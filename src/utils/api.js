import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL || 'http://api.paylens.kro.kr',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("토큰 만료 감지! 새 토큰을 발급받습니다...");
        
        const reissueResponse = await api.post('/api/auth/reissue');
        
        const newAccessToken = reissueResponse.data.result;
        
        localStorage.setItem('accessToken', newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
        
      } catch (reissueError) {
        console.warn("세션이 완전히 만료되었습니다. 로그인 페이지로 이동합니다.");
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;