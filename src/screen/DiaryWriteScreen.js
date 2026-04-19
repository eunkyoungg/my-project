// src/screens/DiaryWriteScreen.js
// 일기 작성 화면 — 감정 + 음악이 자동 연결됨

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ScrollView,
} from 'react-native';
import { useDiary } from '../hooks/useDiary';
import { useEmotion } from '../hooks/useEmotion';
import EmotionCard from '../components/EmotionCard';
import { formatDateKo, getTodayDate } from '../utils/dateUtils';

const DiaryWriteScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { saveWithEmotion } = useDiary();
  const { currentEmotion, emotionMeta, analyze, isAnalyzing } = useEmotion();

  // 내용 변경 시 0.8초 뒤 자동 감정 분석 (디바운스)
  const [debounceTimer, setDebounceTimer] = useState(null);
  const handleContentChange = (text) => {
    setContent(text);
    if (debounceTimer) clearTimeout(debounceTimer);
    if (text.length > 20) {
      const timer = setTimeout(() => analyze(text), 800);
      setDebounceTimer(timer);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('알림', '일기 내용을 입력해주세요.');
      return;
    }
    setIsSaving(true);
    try {
      await saveWithEmotion(content);
      Alert.alert('저장됨', '일기가 저장되었어요!', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.date}>{formatDateKo(getTodayDate())}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving || !content.trim()}
        >
          <Text style={[styles.save, (!content.trim() || isSaving) && styles.saveDisabled]}>
            저장
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.textarea}
          multiline
          placeholder="오늘 하루는 어땠나요? 자유롭게 적어보세요."
          placeholderTextColor="#D1D5DB"
          value={content}
          onChangeText={handleContentChange}
          autoFocus
        />

        {/* 감정 분석 중 표시 */}
        {isAnalyzing && (
          <Text style={styles.analyzing}>✨ 감정 분석 중...</Text>
        )}

        {/* 감지된 감정 + 추천 음악 프리뷰 */}
        {currentEmotion && !isAnalyzing && (
          <View style={styles.emotionPreview}>
            <Text style={styles.previewLabel}>감지된 감정</Text>
            <EmotionCard
              emotion={currentEmotion.emotion}
              intensity={currentEmotion.intensity}
              secondary={currentEmotion.secondary}
              meta={emotionMeta}
            />
            <Text style={styles.saveNote}>
              저장 시 이 감정과 추천 음악이 함께 기록돼요
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  cancel: { fontSize: 15, color: '#6B7280' },
  date: { fontSize: 15, fontWeight: '600', color: '#111827' },
  save: { fontSize: 15, fontWeight: '600', color: '#7C3AED' },
  saveDisabled: { opacity: 0.4 },
  scroll: { flex: 1 },
  textarea: {
    padding: 20, fontSize: 16, color: '#111827',
    lineHeight: 26, minHeight: 200, textAlignVertical: 'top',
  },
  analyzing: {
    paddingHorizontal: 20, color: '#7C3AED', fontSize: 13,
  },
  emotionPreview: { marginTop: 16, paddingBottom: 24 },
  previewLabel: {
    fontSize: 13, color: '#9CA3AF',
    paddingHorizontal: 20, marginBottom: 8,
  },
  saveNote: {
    fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12,
  },
});

export default DiaryWriteScreen;
