import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

type NewsItem = {
  title: string;
  text: string;
  image: string;
};

export default function NewsScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);

  const loadNews = useCallback(async () => {
    try {
      const storedNews = await AsyncStorage.getItem('news');
      console.log('Loaded news:', storedNews);
      if (storedNews) {
        setNews(JSON.parse(storedNews));
      } else {
        setNews([]);
      }
    } catch (e) {
      console.error('Ошибка загрузки новостей:', e);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNews();
    }, [loadNews])
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.newsItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {news.length === 0 ? (
        <Text style={styles.emptyText}>Новостей пока нет</Text>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e', // Добавляем тёмный фон
  },
  newsItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    backgroundColor: '#fff', // Добавляем белый фон для карточек, чтобы текст был читаем
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000', // Чёрный текст для контраста
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000', // Чёрный текст для контраста
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff', // Белый текст для читаемости на тёмном фоне
  },
});