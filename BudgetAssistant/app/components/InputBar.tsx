// app/components/InputBar.tsx
import React, { useState, forwardRef, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TextInput as RNTextInput, Platform, Keyboard } from 'react-native';

interface InputBarProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isGenerating: boolean;
}

const InputBar = forwardRef<RNTextInput, InputBarProps>(
  ({ onSend, onStop, isGenerating }, ref) => {
    const [text, setText] = useState('');

    // Focus input whenever generation stops
    useEffect(() => {
      if (!isGenerating) {
        // Delay slightly to allow UI to update
        setTimeout(() => {
          (ref as React.RefObject<RNTextInput>)?.current?.focus();
        }, 50);
      }
    }, [isGenerating]);

    const handleSend = () => {
      if (!text.trim() || isGenerating) return; // lock while generating
      onSend(text.trim());
      setText('');
      if (Platform.OS !== 'web') Keyboard.dismiss(); // optional
    };

    return (
      <View style={styles.container}>
        <TextInput
          ref={ref as React.RefObject<RNTextInput>}
          value={text}
          onChangeText={setText}
          placeholder="Ask something..."
          style={styles.input}
          multiline={false}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        {isGenerating ? (
          <Button title="Stop" color="red" onPress={onStop} />
        ) : (
          <Button title="Send" onPress={handleSend} />
        )}
      </View>
    );
  }
);

export default InputBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    fontSize: 16,
  },
});
