// src/api/diaryApi.js
// 일기 CRUD API 통신

import apiClient from './apiClient';

/**
 * 일기 작성
 * @param {{ content, emotionId, date, tracks }} entry
 */
export const createDiary = async (entry) => {
  const response = await apiClient.post('/diary', entry);
  return response.data;
};

/**
 * 날짜별 일기 조회
 * @param {string} date - 'YYYY-MM-DD'
 */
export const getDiaryByDate = async (date) => {
  const response = await apiClient.get(`/diary/${date}`);
  return response.data;
};

/**
 * 일기 목록 조회 (감정 필터 가능)
 * @param {{ emotion?: string, page?: number, limit?: number }} params
 */
export const getDiaryList = async (params = {}) => {
  const response = await apiClient.get('/diary', { params });
  return response.data;
};

/**
 * 일기 수정
 * @param {string} id
 * @param {{ content, emotionId }} updates
 */
export const updateDiary = async (id, updates) => {
  const response = await apiClient.put(`/diary/${id}`, updates);
  return response.data;
};

/**
 * 일기 삭제
 * @param {string} id
 */
export const deleteDiary = async (id) => {
  await apiClient.delete(`/diary/${id}`);
};
