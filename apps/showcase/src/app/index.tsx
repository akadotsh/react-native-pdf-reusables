import * as Print from 'expo-print';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text as NativeText, View } from 'react-native';
import {
  Divider,
  Document,
  Heading,
  Image,
  KeyValueList,
  Link,
  Page,
  Signature,
  Stack,
  Text,
  Totals,
  renderToPdf,
  type PdfResult,
} from 'react-native-pdf-reusables';

const documentIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMyNDU3ZDYiLz48cGF0aCBkPSJNMTggMTZoMjBsOCA4djI0SDE4eiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMzggMTZ2MTBoOCIgZmlsbD0iI2I5Y2NmZiIvPjwvc3ZnPg==';

export default function ShowcaseScreen() {
  const [result, setResult] = useState<PdfResult>();
  const [error, setError] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateAndPreview() {
    setError(undefined);
    setResult(undefined);
    setIsGenerating(true);

    try {
      const pdf = await renderToPdf(
        <Document title="PDF Reusables Showcase">
          <Page size="A4" style={{ padding: 32 }}>
            <Stack gap={24}>
              <Stack gap={4}>
                <Stack gap={12} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Image alt="Document icon" src={documentIcon} style={{ height: 48, width: 48 }} />
                  <Stack gap={4}>
                    <Heading style={{ margin: 0 }}>Basic components</Heading>
                    <Text style={{ color: '#475569' }}>A printable component gallery generated on your device.</Text>
                  </Stack>
                </Stack>
                <Divider style={{ borderColor: '#cbd5e1', borderWidth: 1 }} />
              </Stack>

              <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Typography and layout
                </Heading>
                <Text>
                  Text, headings, and vertical stacks provide the foundation for structured PDF documents.
                </Text>
                <Link href="https://github.com/akadotsh/react-native-pdf-reusables" style={{ color: '#2457d6' }}>
                  View the project source
                </Link>
              </Stack>

              <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Key-value list
                </Heading>
                <KeyValueList
                  items={[
                    { label: 'Invoice', value: 'INV-1042' },
                    { label: 'Customer', value: 'Acme & Partners' },
                    { label: 'Date', value: '10 October 2026' },
                  ]}
                />
              </Stack>

              <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Totals
                </Heading>
                <Totals
                  items={[
                    { label: 'Subtotal', value: 'INR 1,000' },
                    { label: 'Tax', value: 'INR 180' },
                    { label: 'Total', value: 'INR 1,180' },
                  ]}
                />
              </Stack>

              <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Signature
                </Heading>
                <Signature label="Authorized signature">
                  <Text>Akash Prasad</Text>
                </Signature>
              </Stack>
            </Stack>
          </Page>
        </Document>,
      );

      setResult(pdf);
      await Print.printAsync({ uri: pdf.uri });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'PDF generation failed');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.hero}>
        <NativeText style={styles.eyebrow}>ON-DEVICE PDF</NativeText>
        <NativeText style={styles.title}>Printable documents, built from reusable components.</NativeText>
        <NativeText style={styles.subtitle}>
          Generate the showcase locally, then inspect the finished PDF in the native print preview.
        </NativeText>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.documentBadge}>
            <NativeText style={styles.documentBadgeText}>PDF</NativeText>
          </View>
          <View style={styles.cardHeading}>
            <NativeText style={styles.cardTitle}>Component showcase</NativeText>
            <NativeText style={styles.cardSubtitle}>A4 · Generated locally</NativeText>
          </View>
        </View>

        <View style={styles.tags}>
          <NativeText style={styles.tag}>Typography</NativeText>
          <NativeText style={styles.tag}>Layout</NativeText>
          <NativeText style={styles.tag}>Data</NativeText>
          <NativeText style={styles.tag}>Signature</NativeText>
        </View>

        <Pressable
          accessibilityLabel="Generate and preview the component showcase PDF"
          accessibilityRole="button"
          disabled={isGenerating}
          onPress={generateAndPreview}
          style={[styles.button, isGenerating ? styles.buttonDisabled : null]}
        >
          <View style={styles.buttonContent}>
            {isGenerating ? <ActivityIndicator color="#ffffff" size="small" /> : null}
            <NativeText style={styles.buttonText}>
              {isGenerating ? 'Generating…' : 'Generate and preview'}
            </NativeText>
          </View>
        </Pressable>

        {result ? (
          <View style={styles.success}>
            <NativeText style={styles.successText}>{result.numberOfPages} page generated successfully</NativeText>
          </View>
        ) : null}
        {error ? (
          <NativeText accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </NativeText>
        ) : null}
      </View>

      <NativeText style={styles.footer}>No server upload. Your document stays on this device.</NativeText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flexGrow: 1,
    gap: 28,
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    alignSelf: 'center',
    gap: 8,
    maxWidth: 560,
    width: '100%',
  },
  eyebrow: {
    color: '#2457d6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderCurve: 'continuous',
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
    gap: 20,
    maxWidth: 560,
    padding: 20,
    width: '100%',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  documentBadge: {
    alignItems: 'center',
    backgroundColor: '#e8eeff',
    borderCurve: 'continuous',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  documentBadgeText: {
    color: '#2457d6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardHeading: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#64748b',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    borderCurve: 'continuous',
    borderRadius: 999,
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2457d6',
    borderCurve: 'continuous',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  success: {
    backgroundColor: '#ecfdf3',
    borderColor: '#bbf7d0',
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  successText: {
    color: '#166534',
    fontWeight: '600',
  },
  error: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    color: '#b91c1c',
    padding: 12,
  },
  footer: {
    alignSelf: 'center',
    color: '#94a3b8',
    fontSize: 13,
    maxWidth: 560,
    textAlign: 'center',
    width: '100%',
  },
});
