// components/Separator.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  style,
}) => {
  const baseStyle =
    orientation === 'horizontal' ? styles.horizontal : styles.vertical;

  return <View style={[baseStyle, style]} />;
};

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#E5E7EB', // gray-300
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
});
