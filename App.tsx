import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GameScreen } from './src/screens/GameScreen';
import { TitleScreen } from './src/screens/TitleScreen';
import { ConfigScreen } from './src/screens/ConfigScreen';
import { StageSelectScreen } from './src/screens/StageSelectScreen';
import { loadGameData } from './src/utils/storage';

type ScreenState = 'title' | 'game' | 'config' | 'stage_select';

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
            onStageSelect={() => setCurrentScreen('stage_select')}
          />
        );
      case 'game':
        return <GameScreen onBack={() => setCurrentScreen('title')} />;
      case 'config':
        return <ConfigScreen onBack={() => setCurrentScreen('title')} />;
      case 'stage_select':
        return (
          <StageSelectScreen
            onSelectLevel={(levelId) => {
              // Save selected level to storage or pass it to GameScreen
              // For now, we might need to update GameScreen to accept initialLevel or update storage
              // But GameScreen loads from storage. So we should save it first.
              // Wait, GameScreen uses `loadGameData` on mount.
              // So we should update storage here.
              // Actually, let's just pass it via a prop or save it.
              // Saving is safer.
              const { saveGameData } = require('./src/utils/storage');
              saveGameData({ currentLevel: levelId }).then(() => {
                setCurrentScreen('game');
              });
            }}
            onBack={() => setCurrentScreen('title')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="auto" />
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
