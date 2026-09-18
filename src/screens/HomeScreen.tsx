import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MODULES } from '../core/moduleRegistry';
import { useProgress } from '../core/ProgressContext';
import { StarBar } from '../core/widgets';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors, fontSizes, radii, spacing } from '../theme/theme';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getModuleProgress } = useProgress();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¡Hola, aprendiz! 👋</Text>
      <Text style={styles.subtitle}>Elige un juego para aprender</Text>

      <View style={styles.grid}>
        {MODULES.map((module) => {
          const progress = getModuleProgress(module.id);
          return (
            <Pressable
              key={module.id}
              onPress={() => navigation.navigate(module.id)}
              style={[styles.card, { backgroundColor: module.color }]}
            >
              <Text style={styles.cardEmoji}>{module.emoji}</Text>
              <Text style={styles.cardTitle}>{module.title}</Text>
              <Text style={styles.cardSubtitle}>{module.subtitle}</Text>
              <View style={styles.cardFooter}>
                <StarBar stars={progress.stars} max={Math.max(3, Math.min(progress.stars, 9))} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonText}>✨ Pronto llegarán más juegos ✨</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl * 1.5, gap: spacing.lg },
  title: { fontSize: fontSizes.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: fontSizes.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  grid: { gap: spacing.md },
  card: {
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardEmoji: { fontSize: 40 },
  cardTitle: { fontSize: fontSizes.title, fontWeight: '800', color: colors.white },
  cardSubtitle: { fontSize: fontSizes.body, color: colors.white, opacity: 0.9 },
  cardFooter: { marginTop: spacing.xs },
  comingSoon: { alignItems: 'center', paddingVertical: spacing.lg },
  comingSoonText: { fontSize: fontSizes.body, color: colors.textLight, fontWeight: '600' },
});
