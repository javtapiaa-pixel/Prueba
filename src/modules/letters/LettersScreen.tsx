import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../../core/ProgressContext';
import { BigButton, Celebration, ScreenHeader, StarBar } from '../../core/widgets';
import { colors, fontSizes, radii, spacing } from '../../theme/theme';
import { LETTERS } from './letters';
import TraceCanvas, { type TraceCanvasHandle } from './TraceCanvas';

const MODULE_ID = 'letters';
const CANVAS_SIZE = Math.min(320, Dimensions.get('window').width - spacing.lg * 2);

type Stage = 'picker' | 'trace';

export default function LettersScreen() {
  const navigation = useNavigation();
  const { getModuleProgress, addStars } = useProgress();
  const moduleProgress = getModuleProgress(MODULE_ID);

  const [stage, setStage] = useState<Stage>('picker');
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedThisSession, setCompletedThisSession] = useState<Set<string>>(new Set());
  const [strokeCount, setStrokeCount] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const canvasRef = useRef<TraceCanvasHandle>(null);

  const activeLetter = LETTERS[activeIndex];

  const speakLetter = useCallback((index: number) => {
    const entry = LETTERS[index];
    Speech.stop();
    Speech.speak(`${entry.letter}. ${entry.word}`, { language: 'es-ES', rate: 0.85 });
  }, []);

  const openLetter = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setStrokeCount(0);
      setStage('trace');
      speakLetter(index);
    },
    [speakLetter]
  );

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
    setStrokeCount(0);
  }, []);

  const handleDone = useCallback(() => {
    if (strokeCount === 0) return;
    const alreadyDone = completedThisSession.has(activeLetter.letter);
    if (!alreadyDone) {
      setCompletedThisSession((prev) => new Set(prev).add(activeLetter.letter));
      addStars(MODULE_ID, 1);
    }
    setCelebrating(true);
    setTimeout(() => {
      setCelebrating(false);
      setStage('picker');
    }, 900);
  }, [strokeCount, completedThisSession, activeLetter, addStars]);

  const goToNextLetter = useCallback(() => {
    const nextIndex = (activeIndex + 1) % LETTERS.length;
    openLetter(nextIndex);
  }, [activeIndex, openLetter]);

  const pickerGrid = useMemo(
    () =>
      LETTERS.map((entry, index) => {
        const done = completedThisSession.has(entry.letter);
        return (
          <Pressable
            key={entry.letter}
            onPress={() => openLetter(index)}
            style={[styles.letterTile, done && styles.letterTileDone]}
          >
            <Text style={styles.letterTileText}>{entry.letter}</Text>
            {done ? <Text style={styles.letterTileCheck}>✓</Text> : null}
          </Pressable>
        );
      }),
    [completedThisSession, openLetter]
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Letras"
        color={colors.letters}
        onBack={() => (stage === 'trace' ? setStage('picker') : navigation.goBack())}
      />

      {stage === 'picker' && (
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerHint}>Elige una letra para practicar cómo se dibuja</Text>
          <StarBar stars={moduleProgress.stars} max={Math.max(3, moduleProgress.stars)} />
          <ScrollView contentContainerStyle={styles.grid}>{pickerGrid}</ScrollView>
        </View>
      )}

      {stage === 'trace' && (
        <View style={styles.traceContainer}>
          <View style={styles.traceHeaderRow}>
            <Text style={styles.wordLabel}>
              {activeLetter.emoji} {activeLetter.word}
            </Text>
            <Pressable onPress={() => speakLetter(activeIndex)} hitSlop={10}>
              <Text style={styles.speakerIcon}>🔊</Text>
            </Pressable>
          </View>

          <View style={[styles.canvasWrap, { width: CANVAS_SIZE, height: CANVAS_SIZE }]}>
            <Text style={styles.guideLetter}>{activeLetter.letter}</Text>
            <TraceCanvas
              ref={canvasRef}
              size={CANVAS_SIZE}
              color={colors.letters}
              onStrokeCountChange={setStrokeCount}
            />
          </View>

          <View style={styles.traceActions}>
            <BigButton label="Borrar" emoji="🧹" color={colors.textLight} onPress={handleClear} />
            <BigButton
              label="¡Listo!"
              emoji="✅"
              color={colors.success}
              onPress={handleDone}
              disabled={strokeCount === 0}
            />
            <BigButton label="Siguiente" emoji="➡️" color={colors.letters} onPress={goToNextLetter} />
          </View>
        </View>
      )}

      <Celebration visible={celebrating} message={`¡Muy bien! ${activeLetter.letter} de ${activeLetter.word}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pickerContainer: { flex: 1, padding: spacing.lg, gap: spacing.md },
  pickerHint: { fontSize: fontSizes.body, color: colors.textLight, textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  letterTile: {
    width: 56,
    height: 56,
    borderRadius: radii.button,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  letterTileDone: { backgroundColor: colors.letters },
  letterTileText: { fontSize: fontSizes.subtitle, fontWeight: '800', color: colors.text },
  letterTileCheck: {
    position: 'absolute',
    top: 2,
    right: 6,
    fontSize: fontSizes.small,
    color: colors.white,
    fontWeight: '800',
  },
  traceContainer: { flex: 1, alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  traceHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  wordLabel: { fontSize: fontSizes.title, fontWeight: '800', color: colors.text },
  speakerIcon: { fontSize: fontSizes.title },
  canvasWrap: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  guideLetter: {
    position: 'absolute',
    fontSize: 220,
    fontWeight: '800',
    color: colors.text,
    opacity: 0.12,
  },
  traceActions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
});
