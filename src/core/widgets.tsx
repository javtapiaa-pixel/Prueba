import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, radii, spacing } from '../theme/theme';

export function BigButton({
  label,
  emoji,
  color,
  onPress,
  disabled,
}: {
  label: string;
  emoji?: string;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        style={[
          styles.bigButton,
          { backgroundColor: color ?? colors.primary, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {emoji ? <Text style={styles.bigButtonEmoji}>{emoji}</Text> : null}
        <Text style={styles.bigButtonLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function ChoiceButton({
  label,
  onPress,
  state,
}: {
  label: string;
  onPress: () => void;
  state?: 'correct' | 'wrong' | 'idle';
}) {
  const bg =
    state === 'correct' ? colors.success : state === 'wrong' ? colors.error : colors.card;
  const textColor = state === 'correct' || state === 'wrong' ? colors.white : colors.text;
  return (
    <Pressable onPress={onPress} style={[styles.choiceButton, { backgroundColor: bg }]}>
      <Text style={[styles.choiceLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function StarBar({ stars, max = 3 }: { stars: number; max?: number }) {
  const shown = Math.min(stars, max);
  return (
    <View style={styles.starRow}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={styles.starIcon}>
          {i < shown ? '⭐' : '☆'}
        </Text>
      ))}
    </View>
  );
}

export function ScreenHeader({
  title,
  color,
  onBack,
}: {
  title: string;
  color: string;
  onBack?: () => void;
}) {
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.backButton} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backButton} />
    </View>
  );
}

export function Celebration({ visible, message }: { visible: boolean; message: string }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    }
  }, [visible, scale]);

  if (!visible) return null;

  return (
    <View style={styles.celebrationOverlay} pointerEvents="none">
      <Animated.View style={[styles.celebrationCard, { transform: [{ scale }] }]}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
        <Text style={styles.celebrationText}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bigButton: {
    borderRadius: radii.button,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bigButtonEmoji: { fontSize: 40, marginBottom: spacing.xs },
  bigButtonLabel: { fontSize: fontSizes.subtitle, fontWeight: '800', color: colors.white },
  choiceButton: {
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  choiceLabel: { fontSize: fontSizes.title, fontWeight: '800' },
  starRow: { flexDirection: 'row', gap: 2 },
  starIcon: { fontSize: fontSizes.subtitle },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerTitle: { fontSize: fontSizes.title, fontWeight: '800', color: colors.white },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 28, color: colors.white, fontWeight: '800' },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  celebrationCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  celebrationEmoji: { fontSize: 56 },
  celebrationText: { fontSize: fontSizes.subtitle, fontWeight: '800', color: colors.text },
});
