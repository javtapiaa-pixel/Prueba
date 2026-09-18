import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MODULES } from '../core/moduleRegistry';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = { Home: undefined } & Record<string, undefined>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {MODULES.map((module) => (
          <Stack.Screen key={module.id} name={module.id} component={module.Component} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
