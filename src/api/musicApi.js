// src/api/musicApi.js
// 음악 추천 및 스트리밍 API 통신

import apiClient from './apiClient';

/**
 * 감정 기반 플레이리스트 추천 요청
 * @param {{ emotion, intensity, userId }} params
 * @returns {Track[]} 추천 트랙 목록
 */
export const getRecommendations = async ({ emotion, intensity }) => {
  const response = await apiClient.get('/recommendations', {
    params: { emotion, intensity },
  });
  return response.data.tracks;
};

/**
 * 사용자 추천 피드백 전송 (좋아요/싫어요)
 * @param {string} trackId
 * @param {'like' | 'dislike'} feedback
 */
export const sendFeedback = async (trackId, feedback) => {
  await apiClient.patch(`/recommendations/${trackId}/feedback`, { feedback });
};

/**
 * 특정 감정의 즐겨찾기 플레이리스트 조회
 * @param {string} emotion
 */
export const getFavoritePlaylist = async (emotion) => {
  const response = await apiClient.get('/playlists/favorites', {
    params: { emotion },
  });
  return response.data;
};
