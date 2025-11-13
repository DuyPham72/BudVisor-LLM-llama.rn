import React from 'react';
// This import seems to be the one your setup prefers
import { Stack } from 'expo-router/stack';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="App" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="upload" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="chunkDetail" 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="chat" 
        options={{ 
          title: 'Finance AI Assistant', 
          headerShown: true,
          headerTitleAlign: 'center',
        }} 
      />
    </Stack>
  );
}