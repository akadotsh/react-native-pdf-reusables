import { router } from 'expo-router';
import { useState, type PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native';
import {
  DataTable,
  Divider,
  Document,
  Heading,
  Image,
  KeepTogether,
  KeyValueList,
  Link,
  Page,
  PageBreak,
  PageFooter,
  PageHeader,
  Signature,
  Stack,
  Text,
  ThemeProvider,
  Totals,
  Watermark,
  renderToHtml,
  renderToPdf,
  type PdfResult,
} from 'react-native-pdf-reusables';

import { useComponentSelection } from '../components/component-selection';
import { usePdfPreview } from '../components/pdf-preview-context';

const documentIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMyNDU3ZDYiLz48cGF0aCBkPSJNMTggMTZoMjBsOCA4djI0SDE4eiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMzggMTZ2MTBoOCIgZmlsbD0iI2I5Y2NmZiIvPjwvc3ZnPg==';

function PreviewTheme({ children, enabled }: PropsWithChildren<{ enabled: boolean }>) {
  if (!enabled) return children;

  return (
    <ThemeProvider tokens={{ colors: { accent: '#0080e8', ink: '#474645' } }}>
      {children}
    </ThemeProvider>
  );
}

export default function PlaygroundScreen() {
  const [result, setResult] = useState<PdfResult>();
  const [error, setError] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const { content, selected } = useComponentSelection();
  const { setPreview } = usePdfPreview();
  const selectedCount = Object.values(selected).filter(Boolean).length;

  async function generateAndPreview() {
    setError(undefined);
    setResult(undefined);
    setIsGenerating(true);

    try {
      const document = (
        <Document title="PDF Reusables Playground">
          <PreviewTheme enabled={selected.theme}>
          <Page
            size="A4"
            style={(theme) => ({ color: theme.colors.ink ?? '#0f172a', padding: 32 })}
          >
            {selected.watermark ? (
              <Watermark style={{ fontSize: 56, fontWeight: 'bold' }}>DRAFT</Watermark>
            ) : null}
            {selected.header ? (
              <PageHeader style={{ borderBottomColor: '#d6d3d1', borderBottomWidth: 1, marginBottom: 20, paddingBottom: 8 }}>
                <Text>PDF Reusables · Component preview</Text>
              </PageHeader>
            ) : null}
            <Stack gap={24}>
              <Stack gap={4}>
                <Stack gap={12} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  {selected.image ? (
                    <Image alt="Document icon" src={documentIcon} style={{ height: 48, width: 48 }} />
                  ) : null}
                  <Stack gap={4}>
                    <Heading style={{ margin: 0 }}>{content.heading}</Heading>
                    <Text style={{ color: '#475569' }}>{content.text}</Text>
                  </Stack>
                </Stack>
                {selected.divider ? (
                  <Divider style={{ borderColor: '#cbd5e1', borderWidth: 1 }} />
                ) : null}
              </Stack>

              <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Typography and layout
                </Heading>
                <Text>
                  Text, headings, and vertical stacks provide the foundation for structured PDF documents.
                </Text>
                {selected.link ? (
                  <Link href="https://github.com/akadotsh/react-native-pdf-reusables" style={{ color: '#2457d6' }}>
                    View the project source
                  </Link>
                ) : null}
              </Stack>

              {selected.details ? <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Key-value list
                </Heading>
                <KeyValueList
                  items={[
                    { label: 'Invoice', value: content.invoice },
                    { label: 'Customer', value: content.customer },
                    { label: 'Date', value: content.date },
                  ]}
                />
              </Stack> : null}

              {selected.totals ? <Stack gap={8}>
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
              </Stack> : null}

              {selected.table ? <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Data table
                </Heading>
                <DataTable
                  columns={[
                    { header: 'Item', render: (row) => row.item },
                    { header: 'Quantity', render: (row) => row.quantity },
                    { header: 'Amount', render: (row) => row.amount },
                  ]}
                  rows={[
                    { amount: 'INR 800', item: 'Consulting', quantity: '2 hours' },
                    { amount: 'INR 200', item: 'Report', quantity: '1' },
                  ]}
                />
              </Stack> : null}

              {selected.keepTogether ? (
                <KeepTogether style={{ backgroundColor: '#f2f0ec', borderRadius: 8, padding: 12 }}>
                  <Heading level={2} style={{ margin: 0 }}>Keep together</Heading>
                  <Text>This heading and paragraph avoid splitting across pages.</Text>
                </KeepTogether>
              ) : null}

              {selected.pageBreak ? <PageBreak /> : null}

              {selected.signature ? <Stack gap={8}>
                <Heading level={2} style={{ margin: 0 }}>
                  Signature
                </Heading>
                <Signature label="Authorized signature">
                  <Text>Akash Prasad</Text>
                </Signature>
              </Stack> : null}
            </Stack>
            {selected.footer ? (
              <PageFooter style={{ borderTopColor: '#d6d3d1', borderTopWidth: 1, marginTop: 20, paddingTop: 8 }}>
                <Text style={{ color: '#78716c', fontSize: 10 }}>Generated locally with react-native-pdf-reusables</Text>
              </PageFooter>
            ) : null}
          </Page>
          </PreviewTheme>
        </Document>
      );
      const html = renderToHtml(document);
      const pdf = await renderToPdf(document);

      setResult(pdf);
      setPreview({ html, numberOfPages: pdf.numberOfPages, uri: pdf.uri });
      router.push('./preview');
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
          Build a document locally, then inspect the finished PDF in the native print preview.
        </NativeText>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.documentBadge}>
            <NativeText style={styles.documentBadgeText}>PDF</NativeText>
          </View>
          <View style={styles.cardHeading}>
            <NativeText style={styles.cardTitle}>Component playground</NativeText>
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
          accessibilityRole="button"
          onPress={() => router.push('./components')}
          style={({ pressed }) => [styles.customize, pressed ? styles.pressed : null]}
        >
          <View>
            <NativeText style={styles.customizeTitle}>Components</NativeText>
            <NativeText style={styles.customizeSubtitle}>{selectedCount} selected</NativeText>
          </View>
          <NativeText style={styles.editLabel}>Edit</NativeText>
        </Pressable>

        <Pressable
          accessibilityLabel="Generate and preview the component playground PDF"
          accessibilityRole="button"
          disabled={isGenerating}
          onPress={generateAndPreview}
          style={({ pressed }) => [
            styles.button,
            isGenerating ? styles.buttonDisabled : null,
            pressed && !isGenerating ? styles.pressed : null,
          ]}
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
    backgroundColor: '#f2f0ec',
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
    color: '#0080e8',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.4,
  },
  title: {
    color: '#474645',
    fontSize: 32,
    fontWeight: '500',
    lineHeight: 38,
  },
  subtitle: {
    color: '#7a7876',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderCurve: 'continuous',
    borderRadius: 24,
    boxShadow: '0 10px 28px rgba(71, 70, 69, 0.08)',
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
    backgroundColor: '#e3f2fd',
    borderCurve: 'continuous',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  documentBadgeText: {
    color: '#0080e8',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardHeading: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    color: '#474645',
    fontSize: 17,
    fontWeight: '500',
  },
  cardSubtitle: {
    color: '#7a7876',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f2f0ec',
    borderCurve: 'continuous',
    borderRadius: 999,
    color: '#7a7876',
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  customize: {
    alignItems: 'center',
    backgroundColor: '#f2f0ec',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  customizeTitle: {
    color: '#474645',
    fontSize: 17,
    fontWeight: '500',
  },
  customizeSubtitle: {
    color: '#7a7876',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  editLabel: {
    color: '#0080e8',
    fontSize: 15,
    fontWeight: '500',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0080e8',
    borderCurve: 'continuous',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.68,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
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
    color: '#7a7876',
    fontSize: 13,
    maxWidth: 560,
    textAlign: 'center',
    width: '100%',
  },
});
