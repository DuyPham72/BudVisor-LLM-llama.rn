// app/setup.tsx
import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { initModelsIfNeeded } from '../services/llamaService';

const MODEL_URL = 'https://www.dropbox.com/scl/fi/29ibpsl2wjzh4ed4ufl7k/gemma-3-1b-it-q4_0.gguf?rlkey=1etghy080szoqzzgi7pl4g023&st=hcr4thes&dl=1';
const EMBEDDING_URL = 'https://www.dropbox.com/scl/fi/k52v2hvv0nb400gsw02yp/embeddinggemma-300m-Q4_0.gguf?rlkey=ajxtfwaic56m04qbyua357p65&st=ng4ee5lp&dl=1';

export default function Setup() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const router = useRouter();

  const startSetup = async () => {
    try {
      setLoading(true);
      setStatus('Downloading and initializing models...');
      await initModelsIfNeeded({
        modelUrl: MODEL_URL,
        embeddingUrl: EMBEDDING_URL,
        onProgress: (text) => setStatus(text),
      });
      setLoading(false);
      router.push('./chat');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err?.message || String(err));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ marginBottom: 10 }}>{status}</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Start Setup / Download Models" onPress={startSetup} />
      )}
    </View>
  );
}
