// components/input.tsx
import React from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  containerStyle,
  style,
  ...props
}) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor="#9CA3AF"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
});
