// components/label.tsx
import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle, View } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Label: React.FC<LabelProps> = ({ children, style }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
