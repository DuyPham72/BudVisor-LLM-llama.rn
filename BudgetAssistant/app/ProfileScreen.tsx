// ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from './components/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/card';
import { Avatar } from './components/avatar';
import { Separator } from './components/seperator';
import type { Screen } from './App';

export interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onOpenMenu: () => void;
}

const paymentHistory = [
  { id: '1', name: 'Housing', amount: 126.41, date: '2025-10-24' },
  { id: '2', name: 'Food', amount: 37.10, date: '2025-10-24' },
  { id: '3', name: 'Food', amount: 129.22, date: '2025-10-18' },
  { id: '4', name: 'Food', amount: 54.99, date: '2025-10-15' },
];

const pastReceipts = [
  { id: '1', store: 'Whole Foods', date: '2025-10-12', amount: 87.45 },
  { id: '2', store: 'Target', date: '2025-10-09', amount: 134.2 },
  { id: '3', store: 'CVS Pharmacy', date: '2025-10-06', amount: 32.15 },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  onOpenMenu,
}) => {
  return (
    <View style={styles.container}>
      {/* Header with back + title + hamburger */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('main')}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info */}
        <Card>
          <CardContent>
            <View style={styles.userInfoContainer}>
              <Avatar
                uri="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                name="Kaesi Winchester"
                size={96}
              />
              <Text style={styles.userName}>Kaesi Winchester</Text>
            </View>
          </CardContent>
        </Card>

        {/* Friends List Button (no navigation wired yet) */}
        <Button
          variant="outline"
          style={styles.fullWidthButton}
          onPress={() => {
            // placeholder for future "friends" screen
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={20}
              color="#111827"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonLabel}>Manage Friends</Text>
          </View>
        </Button>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.map((payment, index) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentTextBlock}>
                  <Text style={styles.paymentName}>{payment.name}</Text>
                  <Text style={styles.paymentDate}>{payment.date}</Text>
                </View>
                <Text style={styles.paymentAmount}>
                  -${payment.amount.toFixed(2)}
                </Text>
                {index < paymentHistory.length - 1 && (
                  <Separator style={styles.paymentSeparator} />
                )}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Past Receipts */}
        <Card>
          <CardHeader>
            <CardTitle>Past Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            {pastReceipts.map((receipt) => (
              <View key={receipt.id} style={styles.receiptRow}>
                <View style={styles.receiptLeft}>
                  <View style={styles.receiptIconContainer}>
                    <MaterialCommunityIcons
                      name="receipt-outline"
                      size={20}
                      color="#4F46E5"
                    />
                  </View>
                  <View>
                    <Text style={styles.receiptStore}>{receipt.store}</Text>
                    <Text style={styles.receiptDate}>{receipt.date}</Text>
                  </View>
                </View>
                <Text style={styles.receiptAmount}>
                  ${receipt.amount.toFixed(2)}
                </Text>
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
    backgroundColor: '#F3F4F6',
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
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  userName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  emailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 15,
    color: '#111827',
  },
  paymentItem: {
    paddingVertical: 8,
  },
  paymentTextBlock: {
    flexDirection: 'column',
  },
  paymentName: {
    fontSize: 15,
    color: '#111827',
  },
  paymentDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  paymentAmount: {
    marginTop: 4,
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '500',
    textAlign: 'right',
  },
  paymentSeparator: {
    marginTop: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  receiptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  receiptIconContainer: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#E0E7FF',
  },
  receiptStore: {
    fontSize: 15,
    color: '#111827',
  },
  receiptDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  receiptAmount: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
});
