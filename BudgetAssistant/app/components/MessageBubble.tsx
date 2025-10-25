import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  role: 'user' | 'assistant';
  text: string;
}

const MessageBubble = React.memo(({ role, text }: Props) => {
  return (
    <View
      style={{
        alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: role === 'user' ? '#DCF8C6' : '#EEE',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
        maxWidth: '80%',
      }}
    >
      <Text style={{ color: '#000' }}>{text}</Text>
    </View>
  );
});

export default MessageBubble;
