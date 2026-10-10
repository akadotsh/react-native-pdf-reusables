# react-native-pdf-reusables

Typed, source-owned building blocks for printable React Native and Expo
documents.

## Components

- `Document` and `Page`
- `Stack`, `Heading`, `Text`, `Image`, `Divider`, and `Link`
- `renderToHtml` and `renderToPdf`

Install the Expo Print backend in the consuming application:

```sh
npx expo install expo-print
```

```tsx
import {
  Divider,
  Document,
  Heading,
  Link,
  Page,
  Stack,
  Text,
  ThemeProvider,
  registerFont,
  renderToHtml,
  renderToPdf,
} from 'react-native-pdf-reusables';

registerFont({
  family: 'Inter',
  src: 'data:font/woff2;base64,...',
  weight: 400,
});

const document = (
  <Document title="Invoice">
    <ThemeProvider
      tokens={{
        colors: { accent: '#2457d6' },
        fonts: { body: 'Inter' },
        spacing: { page: 24 },
      }}
    >
      <Page
        style={({ fonts, spacing }) => ({
          fontFamily: fonts.body,
          paddingHorizontal: spacing.page,
        })}
      >
        <Stack gap={12}>
          <Heading style={({ colors }) => ({ color: colors.accent })}>Invoice</Heading>
          <Text>INV-1042</Text>
          <Divider />
          <Link href="https://example.com">View online</Link>
        </Stack>
      </Page>
    </ThemeProvider>
  </Document>
);

const html = renderToHtml(document);
const pdf = await renderToPdf(document);

console.log(pdf.uri, pdf.numberOfPages);
```

Font sources may be remote URLs or data URIs. A later registration with the
same family, style, and weight replaces the earlier one.
