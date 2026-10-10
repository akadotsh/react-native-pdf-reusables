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
  renderToHtml,
  renderToPdf,
} from 'react-native-pdf-reusables';

const document = (
  <Document title="Invoice">
    <Page>
      <Stack gap={12} style={{ padding: 24 }}>
        <Heading>Invoice</Heading>
        <Text>INV-1042</Text>
        <Divider />
        <Link href="https://example.com">View online</Link>
      </Stack>
    </Page>
  </Document>
);

const html = renderToHtml(document);
const pdf = await renderToPdf(document);

console.log(pdf.uri, pdf.numberOfPages);
```
