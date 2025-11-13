// App.tsx
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { MainScreen } from './MainScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { ProfileScreen } from './ProfileScreen';
import { BankCardsScreen } from './BankCardsScreen';
import UploadScreen from './upload';
import { BurgerMenu } from './components/burgermenu';
import { FloatingChatButton } from './components/FloatingChatButton';

// include 'login' in Screen type
export type Screen =
  | 'main'
  | 'leaderboard'
  | 'profile'
  | 'bankcards'
  | 'upload';

export default function App() {
  // default to "login" now
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return (
          <MainScreen
            onNavigate={setCurrentScreen}
            onOpenMenu={() => setMenuOpen(true)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={setCurrentScreen}
            onOpenMenu={() => setMenuOpen(true)}
          />
        );
      case 'bankcards':
        return (
          <BankCardsScreen
            onBack={() => setCurrentScreen('main')}
            onOpenMenu={() => setMenuOpen(true)}
          />
        );
      case 'upload':
        return (
          <UploadScreen
            onBack={() => setCurrentScreen('main')}
            onOpenMenu={() => setMenuOpen(true)}
          />
        );
      case 'leaderboard':
      default:
        return (
          <LeaderboardScreen
            onBack={() => setCurrentScreen("main")}
            onOpenMenu={() => setMenuOpen(true)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1 }}>
          {renderScreen()}

          <FloatingChatButton />

          <BurgerMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onNavigate={(screen) => {
              if (
                screen === 'main' ||
                screen === 'leaderboard' ||
                screen === 'profile' ||
                screen === 'bankcards' ||
                screen === 'upload'
              ) {
                setCurrentScreen(screen);
              }
              setMenuOpen(false);
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});
