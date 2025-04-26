import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function FormScreen() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нужно разрешение для доступа к галерее!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveForm = async () => {
    if (!image) {
      Alert.alert('Ошибка', 'Пожалуйста, прикрепите изображение!');
      return;
    }
    if (!title || !text) {
      Alert.alert('Ошибка', 'Заполните все поля!');
      return;
    }

    try {
      const existingNews = await AsyncStorage.getItem('news');
      console.log('Existing news:', existingNews);
      const newsArray = existingNews ? JSON.parse(existingNews) : [];

      const newNews = { title, text, image };
      newsArray.push(newNews);

      await AsyncStorage.setItem('news', JSON.stringify(newsArray));
      console.log('Saved news:', newsArray);
      Alert.alert('Успех', 'Новость сохранена!');

      setTitle('');
      setText('');
      setImage(null);

      router.push('/news');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить данные');
      console.error('Save error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Заголовок</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Введите заголовок"
        placeholderTextColor="#888" // Серый цвет для placeholder
      />
      <Text style={styles.label}>Текст</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={text}
        onChangeText={setText}
        placeholder="Введите текст"
        placeholderTextColor="#888" // Серый цвет для placeholder
        multiline
      />
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <Button title="Выбрать из галереи" onPress={pickImage} />
      <Button title="Сфотографировать" onPress={takePhoto} />
      <Button title="Сохранить" onPress={saveForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e', // Добавляем тёмный фон
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff', // Белый текст для читаемости на тёмном фоне
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff', // Белый фон для полей ввода
    color: '#000', // Чёрный текст для читаемости
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});