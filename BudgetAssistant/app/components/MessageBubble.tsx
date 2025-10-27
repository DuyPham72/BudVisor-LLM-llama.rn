// BudgetAssistant/app/components/MessageBubble.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  role: 'user' | 'assistant';
  text: string;
}

const MessageBubble = React.memo(({ role, text }: Props) => {

  const renderFormattedText = (input: string): React.ReactNode => {
    if (!input) return null;

    // Match bold **text**, italic _text_, code `text`
    const regex = /(\*\*.*?\*\*|_.*?_|\`.*?\`)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(input)) !== null) {
      const index = match.index!;
      const token = match[0];

      // Push text before the match
      if (index > lastIndex) {
        parts.push(input.slice(lastIndex, index));
      }

      // Determine style
      let style: any = {};
      let content = token;

      if (token.startsWith('**') && token.endsWith('**')) {
        style.fontWeight = 'bold';
        content = token.slice(2, -2);
      } else if (token.startsWith('_') && token.endsWith('_')) {
        style.fontStyle = 'italic';
        content = token.slice(1, -1);
      } else if (token.startsWith('`') && token.endsWith('`')) {
        style.fontFamily = 'monospace';
        style.backgroundColor = '#eee';
        style.paddingHorizontal = 2;
        style.borderRadius = 2;
        content = token.slice(1, -1);
      }

      parts.push(<Text style={style} key={index}>{content}</Text>);

      lastIndex = index + token.length;
    }

    // Push remaining text after last match
    if (lastIndex < input.length) {
      parts.push(input.slice(lastIndex));
    }

    return <Text>{parts}</Text>;
  };

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
      {renderFormattedText(text)}
    </View>
  );
});

export default MessageBubble;
