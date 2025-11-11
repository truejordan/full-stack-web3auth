import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useUniwind } from 'uniwind';

export default function TabTwoScreen() {
  const { theme } = useUniwind();
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-foreground">{theme}</Text>
    </View>
  );
}
