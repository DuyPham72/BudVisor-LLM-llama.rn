// LeaderboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, CardContent, CardHeader, CardTitle } from './components/card';
import { Avatar } from './components/avatar';
import { Badge } from './components/badge';

export interface LeaderboardScreenProps {
  onOpenMenu: () => void;
  onBack: () => void;
}

const leaderboardData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    streak: 45,
    rank: 1,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    streak: 38,
    rank: 2,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    streak: 32,
    rank: 3,
  },
];

const otherFriends = [
  {
    id: '4',
    name: 'Alex Martinez',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    streak: 28,
    rank: 4,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    streak: 22,
    rank: 5,
  },
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBack,
  onOpenMenu,
}) => {
  return (
    <View style={styles.container}>
      {/* Header with title + hamburger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity onPress={onOpenMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top 3 */}
        <Card>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <CardTitle>Top Budget Followers</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            {leaderboardData.map((user) => (
              <View key={user.id} style={styles.topUserRow}>
                <Avatar uri={user.avatar} name={user.name} size={56} />

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.streakRow}>
                    <Text style={styles.streakText}>
                      {user.streak} day streak
                    </Text>
                  </View>
                </View>

                {user.rank === 1 && (
                  <Badge variant="default" label="Champion" />
                )}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Other Friends */}
        <Card>
          <CardHeader>
            <CardTitle>Other Friends</CardTitle>
          </CardHeader>
          <CardContent>
            {otherFriends.map((user) => (
              <View key={user.id} style={styles.friendRow}>
                <Text style={styles.friendRank}>{user.rank}</Text>
                <Avatar uri={user.avatar} name={user.name} size={40} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.streakRow}>
                    <Text style={styles.friendStreakText}>
                      {user.streak} days
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // gray-100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  menuButton: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#EEF2FF', // indigo-50
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakText: {
    fontSize: 14,
    color: '#EA580C',
    fontWeight: '500',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#F9FAFB',
  },
  iconButton: {
    padding: 4,
  },
  friendRank: {
    width: 32,
    fontSize: 16,
    color: '#6B7280',
  },
  friendStreakText: {
    fontSize: 14,
    color: '#4B5563',
  },
});
