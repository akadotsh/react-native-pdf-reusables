import * as Print from 'expo-print';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DocumentPreview } from '../components/document-preview';
import { usePdfPreview } from '../components/pdf-preview-context';

export default function PreviewScreen() {
  const { preview } = usePdfPreview();
  const [error, setError] = useState<string>();

  if (!preview) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>No preview generated</Text>
        <Text style={styles.subtitle}>Generate a document from the playground first.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <Text style={styles.buttonLabel}>Back to playground</Text>
        </Pressable>
      </View>
    );
  }

  const currentPreview = preview;

  async function openSystemPreview() {
    try {
      setError(undefined);
      await Print.printAsync({ uri: currentPreview.uri });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not open the system preview');
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={styles.copy}>
          <Text style={styles.title}>Document preview</Text>
          <Text style={styles.subtitle}>{currentPreview.numberOfPages} pages · Generated on this device</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={openSystemPreview}
          style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.secondaryButtonLabel}>Print / export</Text>
        </Pressable>
      </View>

      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>
      ) : null}

      <DocumentPreview html={currentPreview.html} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f2f0ec',
    flex: 1,
    gap: 14,
    padding: 16,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: '#f2f0ec',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    padding: 24,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: '#474645',
    fontSize: 18,
    fontWeight: '500',
  },
  subtitle: {
    color: '#7a7876',
    fontSize: 13,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0080e8',
    borderCurve: 'continuous',
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 48,
    paddingHorizontal: 18,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderCurve: 'continuous',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  secondaryButtonLabel: {
    color: '#0080e8',
    fontSize: 14,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.68,
  },
  error: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    color: '#b91c1c',
    padding: 12,
  },
});
