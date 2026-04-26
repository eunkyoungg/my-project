// src/api/emotionApi.js
// 감정 분석 API 통신

import apiClient from './apiClient';

/**
 * 텍스트로 감정 분석 요청
 * @param {string} text - 분석할 텍스트 (일기 내용 등)
 * @returns {{ emotion, intensity, secondary, valence, arousal }}
 */
export const analyzeEmotion = async (text) => {
  const response = await apiClient.post('/emotions/analyze', { text });
  return response.data;
};

/**
 * 특정 날짜의 감정 기록 조회
 * @param {string} date - 'YYYY-MM-DD' 형식
 */
export const getEmotionByDate = async (date) => {
  const response = await apiClient.get(`/emotions/${date}`);
  return response.data;
};

/**
 * 주간 감정 패턴 조회
 */
export const getWeeklyPattern = async () => {
  const response = await apiClient.get('/emotions/patterns/weekly');
  return response.data;
};
