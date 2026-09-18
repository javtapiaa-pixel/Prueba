import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from './src/core/ProgressContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
