import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProgress } from '../../core/ProgressContext';
import { ChoiceButton, ScreenHeader, StarBar } from '../../core/widgets';
import { colors, fontSizes, radii, spacing } from '../../theme/theme';
import { generateWordRound, type WordRound } from './words';

const MODULE_ID = 'reading';
const TOTAL_ROUNDS = 8;

type Stage = 'intro' | 'playing' | 'result';

function speakWord(word: string) {
  Speech.stop();
  Speech.speak(word, { language: 'es-ES', rate: 0.8 });
}

export default function ReadingScreen() {
  const navigation = useNavigation();
  const { getModuleProgress, addStars, registerSession } = useProgress();
  const moduleProgress = getModuleProgress(MODULE_ID);

  const [stage, setStage] = useState<Stage>('intro');
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [current, setCurrent] = useState<WordRound | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);

  useEffect(() => {
    if (stage === 'playing' && current) {
      speakWord(current.target.word);
    }
  }, [stage, current]);

  const startGame = useCallback(() => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setCurrent(generateWordRound());
    setStage('playing');
    registerSession(MODULE_ID);
  }, [registerSession]);

  const nextRound = useCallback(
    (wasCorrect: boolean) => {
      const nextCorrect = correct + (wasCorrect ? 1 : 0);
      const nextRoundIndex = round + 1;
      setCorrect(nextCorrect);
      setSelected(null);

      if (nextRoundIndex >= TOTAL_ROUNDS) {
        const stars = nextCorrect >= 7 ? 3 : nextCorrect >= 5 ? 2 : nextCorrect >= 3 ? 1 : 0;
        setEarnedStars(stars);
        if (stars > 0) addStars(MODULE_ID, stars);
        setStage('result');
        return;
      }

      setRound(nextRoundIndex);
      setCurrent(generateWordRound());
    },
    [correct, round, addStars]
  );

  const onAnswer = useCallback(
    (word: string) => {
      if (selected !== null || !current) return;
      setSelected(word);
      const wasCorrect = word === current.target.word;
      setTimeout(() => nextRound(wasCorrect), 700);
    },
    [selected, current, nextRound]
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Palabras" color={colors.reading} onBack={() => navigation.goBack()} />

      {stage === 'intro' && (
        <View style={styles.centerContent}>
          <Text style={styles.introEmoji}>📖</Text>
          <Text style={styles.introTitle}>Mis primeras palabras</Text>
          <Text style={styles.introBody}>
            Escucha la palabra y toca la imagen o la palabra correcta.
          </Text>
          <StarBar stars={moduleProgress.stars} max={Math.max(3, moduleProgress.stars)} />
          <ChoiceButton label="Jugar ▶" onPress={startGame} />
        </View>
      )}

      {stage === 'playing' && current && (
        <View style={styles.playArea}>
          <Text style={styles.roundLabel}>
            Ronda {round + 1} de {TOTAL_ROUNDS}
          </Text>
          <View style={styles.wordCard}>
            <Text style={styles.emojiText}>{current.target.emoji}</Text>
            <Pressable onPress={() => speakWord(current.target.word)} hitSlop={10}>
              <Text style={styles.speakerIcon}>🔊 Escuchar</Text>
            </Pressable>
          </View>
          <View style={styles.optionsColumn}>
            {current.options.map((option) => {
              let state: 'correct' | 'wrong' | 'idle' | undefined;
              if (selected !== null) {
                if (option === current.target.word) state = 'correct';
                else if (option === selected) state = 'wrong';
              }
              return (
                <ChoiceButton key={option} label={option} state={state} onPress={() => onAnswer(option)} />
              );
            })}
          </View>
        </View>
      )}

      {stage === 'result' && (
        <View style={styles.centerContent}>
          <Text style={styles.introEmoji}>{earnedStars >= 2 ? '🏆' : '👍'}</Text>
          <Text style={styles.introTitle}>
            ¡Acertaste {correct} de {TOTAL_ROUNDS}!
          </Text>
          <StarBar stars={earnedStars} max={3} />
          <ChoiceButton label="Jugar de nuevo ▶" onPress={startGame} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  introEmoji: { fontSize: fontSizes.huge },
  introTitle: {
    fontSize: fontSizes.title,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  introBody: {
    fontSize: fontSizes.body,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 320,
  },
  playArea: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  roundLabel: {
    textAlign: 'center',
    fontSize: fontSizes.small,
    color: colors.textLight,
    fontWeight: '700',
  },
  wordCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  emojiText: { fontSize: 80 },
  speakerIcon: { fontSize: fontSizes.body, fontWeight: '700', color: colors.reading },
  optionsColumn: { gap: spacing.md, alignItems: 'stretch' },
});
