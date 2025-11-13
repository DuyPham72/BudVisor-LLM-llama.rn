// BudgetAssistant/app/components/burgermenu.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Sheet, SheetContent } from './sheet';
import { Button } from './button';
import { Separator } from './seperator';

interface BurgerMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (screen: string) => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
  open,
  onOpenChange,
  onNavigate,
}) => {
  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>   
        <View style={styles.menuSection}>
          <Button
            variant="ghost"
            style={styles.menuButton}
            onPress={() => handleNavigate('profile')}
            
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={20}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Profile</Text>
          </Button>

          <Button
            variant="ghost"
            style={styles.menuButton}
            onPress={() => handleNavigate('leaderboard')}
          >
            <MaterialCommunityIcons
              name="trophy-variant-outline"
              size={20}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Leaderboard</Text>
          </Button>

          <Button
            variant="ghost"
            style={styles.menuButton}
            onPress={() => handleNavigate('bankcards')}
          >
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={20}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Bank Cards</Text>
          </Button>

          <Button
            variant="ghost"
            style={styles.menuButton}
            onPress={() => handleNavigate('upload')}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={20}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Upload File</Text>
          </Button>

          <Separator style={styles.separator} />

          <Button
            variant="ghost"
            style={styles.menuButton}
            onPress={() => handleNavigate('settings')}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={20}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Settings</Text>
          </Button>

          <Button variant="ghost" style={styles.menuButton}>
            <MaterialCommunityIcons
              name="web"
              size={20}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Language</Text>
          </Button>

          <Separator style={styles.separator} />

          <Button variant="ghost" style={[styles.menuButton, styles.logoutBtn]}>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              style={[styles.menuIcon, styles.logoutIcon]}
            />
            <Text style={[styles.menuLabel, styles.logoutLabel]}>Log Out</Text>
          </Button>
        </View>
      </SheetContent>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 16,
  },
  menuSection: {
    gap: 4,
    paddingTop: 50, 
  },
  menuButton: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  menuIcon: {
    marginRight: 12,
    color: '#374151',
  },
  menuLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '400',
  },
  logoutBtn: {
    marginTop: 8,
  },
  logoutIcon: {
    color: '#DC2626',
  },
  logoutLabel: {
    color: '#DC2626',
  },
});