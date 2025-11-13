// ui/avatar.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle, ImageStyle } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 40,
  style,
  imageStyle,
}) => {
  const initials =
    name
      ?.split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          styles.image,
          imageStyle,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        styles.fallback,
        style,
      ]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fallback: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#374151',
    fontWeight: '600',
  },
});
