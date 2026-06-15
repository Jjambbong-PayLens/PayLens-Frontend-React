import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL || 'https://api.paylens.kro.kr',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/api/auth/reissue')) {
      console.log("➡️ [API 요청] 토큰 재발급 API 호출 시도 (인증 헤더 제외)");
      return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      config.headers['Authorization'] = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/api/auth/reissue')) {
      console.error("🚨 [Auth] 재발급 API 자체가 실패했습니다. 세션을 만료시킵니다.");
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const isAuthError = error.response && (error.response.status === 401 || error.response.status === 403);

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        console.warn(`⚠️ [Auth] 인증 에러(${error.response.status}) 감지! /api/auth/reissue API 호출을 시작합니다.`);
        
        const reissueResponse = await axios.post(
          `${api.defaults.baseURL}/api/auth/reissue`, 
          {}, 
          { withCredentials: true }
        );
        
        console.log("🔍 [Auth] 서버로부터 수신한 재발급 데이터:", reissueResponse.data);

        const newAccessToken = reissueResponse.data?.result;
        
        if (!newAccessToken) {
          throw new Error("서버 응답은 성공했으나 토큰 데이터(result)가 비어있습니다.");
        }

        console.log("✅ [Auth] 새로운 Access Token 발급 및 저장 성공!");
        localStorage.setItem('accessToken', newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        console.log(`🚀 [Auth] 새 토큰으로 기존 요청 재전송: [${originalRequest.method?.toUpperCase()}] ${originalRequest.url}`);
        return api(originalRequest);
        
      } catch (reissueError) {
        console.error("❌ [Auth] 자동 토큰 재발급 프로세스 최종 실패");
        console.error("실패 상세 사유:", reissueError.response?.data || reissueError.message);
        
        localStorage.removeItem('accessToken');
        alert("인증이 만료되어 다시 로그인이 필요합니다.");
        window.location.href = '/login';
        
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;