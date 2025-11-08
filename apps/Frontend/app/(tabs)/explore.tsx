import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useUniwind } from 'uniwind';

// import { Collapsible } from '@/components/ui/collapsible';
// import { ExternalLink } from '@/components/external-link';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const { theme } = useUniwind();
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-foreground">{theme}</Text>
    </View>
  );
}
