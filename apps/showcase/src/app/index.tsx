import * as Print from 'expo-print';
import { useState } from 'react';
import { Button, StyleSheet, Text as NativeText, View } from 'react-native';
import {
  Divider,
  Document,
  Heading,
  Image,
  Page,
  Stack,
  Text,
  renderToPdf,
  type PdfResult,
} from 'react-native-pdf-reusables';

const documentIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMyNDU3ZDYiLz48cGF0aCBkPSJNMTggMTZoMjBsOCA4djI0SDE4eiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMzggMTZ2MTBoOCIgZmlsbD0iI2I5Y2NmZiIvPjwvc3ZnPg==';

export default function ShowcaseScreen() {
  const [result, setResult] = useState<PdfResult>();
  const [error, setError] = useState<string>();

  async function generateAndPreview() {
    setError(undefined);

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
              </Stack>
            </Stack>
          </Page>
        </Document>,
      );

      setResult(pdf);
      await Print.printAsync({ uri: pdf.uri });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'PDF generation failed');
    }
  }

  return (
    <View style={styles.container}>
      <NativeText style={styles.title}>Basic components</NativeText>
      <Button title="Generate and preview PDF" onPress={generateAndPreview} />
      {result ? <NativeText>{result.numberOfPages} page generated</NativeText> : null}
      {error ? <NativeText style={styles.error}>{error}</NativeText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  error: {
    color: '#b91c1c',
  },
});
