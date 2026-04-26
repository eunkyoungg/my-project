// src/api/apiClient.js
// Axios 기본 설정 — 모든 API 호출의 베이스

import axios from 'axios';
import { getToken, refreshToken } from '../utils/auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.moodtune.app/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 — 모든 요청에 JWT 자동 첨부
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터 — 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      await refreshToken();
      return apiClient(original);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
