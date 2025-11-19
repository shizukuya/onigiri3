import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GameScreen } from './src/screens/GameScreen';
import { TitleScreen } from './src/screens/TitleScreen';
import { ConfigScreen } from './src/screens/ConfigScreen';
import { loadGameData } from './src/utils/storage';

type ScreenState = 'title' | 'game' | 'config';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('title');

  useEffect(() => {
    // Initialize app (load data, etc.)
    loadGameData();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return (
          <TitleScreen
            onStart={() => setCurrentScreen('game')}
            onConfig={() => setCurrentScreen('config')}
          />
        );
      case 'game':
        return <GameScreen onBack={() => setCurrentScreen('title')} />;
      case 'config':
        return <ConfigScreen onBack={() => setCurrentScreen('title')} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="auto" hidden />
        {renderScreen()}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
