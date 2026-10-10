import * as Print from 'expo-print';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image as NativeImage,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { renderToHtml, renderToPdf } from 'react-native-pdf-reusables';
import { WebView } from 'react-native-webview';

import validationMark from '../../assets/validation-mark.svg';
import { BehaviorDocument } from '../components/behavior-document';

const localImageUri = NativeImage.resolveAssetSource(validationMark).uri;
const document = <BehaviorDocument localImageUri={localImageUri} />;
const previewHtml = renderToHtml(document).replace(
  '<head>',
  '<head><meta name="viewport" content="width=794"><style>@media screen{body{background:#d8d5d0;padding:16px}[data-pdf-page]{background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12);box-sizing:border-box}}</style>',
);

export default function BehaviorScreen() {
  const [error, setError] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  async function openNativePreview() {
    setError(undefined);
    setIsGenerating(true);

    try {
      const pdf = await renderToPdf(document);
      await Print.printAsync({ uri: pdf.uri });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'PDF generation failed');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <View style={styles.copy}>
          <Text style={styles.title}>Behavior preview</Text>
          <Text style={styles.subtitle}>Fast HTML preview · Native PDF for final checks</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={isGenerating}
          onPress={openNativePreview}
          style={({ pressed }) => [
            styles.button,
            isGenerating ? styles.buttonDisabled : null,
            pressed && !isGenerating ? styles.pressed : null,
          ]}
        >
          {isGenerating ? <ActivityIndicator color="#ffffff" size="small" /> : null}
          <Text style={styles.buttonLabel}>{isGenerating ? 'Generating…' : 'Open native PDF'}</Text>
        </Pressable>
      </View>

      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>
      ) : null}

      <View style={styles.preview}>
        <WebView
          allowFileAccess
          originWhitelist={['*']}
          source={{ html: previewHtml }}
          style={styles.webView}
        />
      </View>
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
  summary: {
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
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonLabel: {
    color: '#ffffff',
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
  preview: {
    borderCurve: 'continuous',
    borderRadius: 18,
    flex: 1,
    overflow: 'hidden',
  },
  webView: {
    backgroundColor: '#d8d5d0',
    flex: 1,
  },
});
