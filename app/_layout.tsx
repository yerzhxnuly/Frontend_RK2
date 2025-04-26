import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'StickerSmash',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image" size={size} color={color} /> // Заменили "stickers" на "image"
          ),
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          title: 'Form',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}