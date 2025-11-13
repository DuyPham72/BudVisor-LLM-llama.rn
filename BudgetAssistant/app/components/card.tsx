// ui/card.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface CardSectionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface CardTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const CardHeader: React.FC<CardSectionProps> = ({
  children,
  style,
}) => <View style={[styles.cardHeader, style]}>{children}</View>;

export const CardContent: React.FC<CardSectionProps> = ({
  children,
  style,
}) => <View style={[styles.cardContent, style]}>{children}</View>;

export const CardFooter: React.FC<CardSectionProps> = ({
  children,
  style,
}) => <View style={[styles.cardFooter, style]}>{children}</View>;

export const CardTitle: React.FC<CardTextProps> = ({ children, style }) => (
  <Text style={[styles.cardTitle, style]}>{children}</Text>
);

export const CardDescription: React.FC<CardTextProps> = ({
  children,
  style,
}) => <Text style={[styles.cardDescription, style]}>{children}</Text>;

// If you ever need an "action" area (e.g. button on the right)
export const CardAction: React.FC<CardSectionProps> = ({
  children,
  style,
}) => <View style={[styles.cardAction, style]}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  cardAction: {
    alignSelf: 'flex-end',
  },
});
