// src/screens/HomeScreen.js
// 홈 화면 — 감정 입력 + 실시간 음악 추천

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet, SafeAreaView,
} from 'react-native';
import EmotionCard from '../components/EmotionCard';
import TrackItem from '../components/TrackItem';
import { useEmotion } from '../hooks/useEmotion';
import { sendFeedback } from '../api/musicApi';

const HomeScreen = () => {
  const [inputText, setInputText] = useState('');
  const {
    currentEmotion,
    emotionMeta,
    playlist,
    currentTrack,
    isLoading,
    isAnalyzing,
    error,
    analyze,
    setCurrentTrack,
    clearError,
  } = useEmotion();

  const handleAnalyze = () => {
    analyze(inputText);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.greeting}>오늘 기분이 어때요?</Text>
          <Text style={styles.sub}>지금 느끼는 감정을 자유롭게 적어보세요</Text>
        </View>

        {/* 감정 입력 */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="예) 오늘 발표가 잘 돼서 너무 기뻐요..."
            placeholderTextColor="#D1D5DB"
            value={inputText}
            onChangeText={setInputText}
            maxLength={300}
          />
          <TouchableOpacity
            style={[styles.btn, (!inputText.trim() || isLoading) && styles.btnDisabled]}
            onPress={handleAnalyze}
            disabled={!inputText.trim() || isLoading}
          >
            {isAnalyzing
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={styles.btnText}>감정 분석하기</Text>
            }
          </TouchableOpacity>
        </View>

        {/* 에러 */}
        {error && (
          <TouchableOpacity style={styles.errorBanner} onPress={clearError}>
            <Text style={styles.errorText}>⚠️ {error} (탭하여 닫기)</Text>
          </TouchableOpacity>
        )}

        {/* 감정 카드 */}
        {currentEmotion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>감지된 감정</Text>
            <EmotionCard
              emotion={currentEmotion.emotion}
              intensity={currentEmotion.intensity}
              secondary={currentEmotion.secondary}
              meta={emotionMeta}
            />
          </View>
        )}

        {/* 음악 추천 목록 */}
        {playlist.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {emotionMeta?.emoji} 지금 이 노래 어때요
            </Text>
            {playlist.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                isPlaying={currentTrack?.id === track.id}
                onPress={setCurrentTrack}
                onFeedback={sendFeedback}
              />
            ))}
          </View>
        )}

        {/* 로딩 — 음악 추천 중 */}
        {isLoading && !isAnalyzing && (
          <View style={styles.loadingMusic}>
            <ActivityIndicator color="#7C3AED" />
            <Text style={styles.loadingText}>음악 추천 중...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  header: { padding: 24, paddingBottom: 16 },
  greeting: { fontSize: 26, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  inputWrapper: { marginHorizontal: 16, gap: 10 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  section: { marginTop: 28 },
  sectionTitle: {
    fontSize: 16, fontWeight: '600', color: '#374151',
    marginBottom: 12, paddingHorizontal: 16,
  },
  errorBanner: {
    margin: 16, padding: 12,
    backgroundColor: '#FEF2F2', borderRadius: 10,
  },
  errorText: { color: '#EF4444', fontSize: 13 },
  loadingMusic: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginTop: 24,
  },
  loadingText: { color: '#7C3AED', fontSize: 14 },
});

export default HomeScreen;
