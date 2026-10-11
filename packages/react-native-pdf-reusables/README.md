# react-native-pdf-reusables

Source-owned building blocks for printable React Native and Expo documents.

Copy individual components into your project:

```sh
npx react-native-pdf-reusables@latest add text heading stack
```

Or install the complete component and renderer stack:

```sh
npx react-native-pdf-reusables@latest add renderer
```

The CLI writes to `src/components/pdf` when the project has a `src` directory,
or `components/pdf` otherwise. It preserves changed files unless you pass
`--overwrite`.

## Components

- `Document` and `Page`
- `Stack`, `Heading`, `Text`, `Image`, `Divider`, and `Link`
- `renderToHtml` and `renderToPdf`

Install the optional Expo Print backend when using `renderToPdf`:

```sh
npx expo install expo-print
```

```tsx
import { Document } from './components/pdf/document';
import { Heading } from './components/pdf/heading';
import { Page } from './components/pdf/page';
import { Stack } from './components/pdf/stack';
import { Text } from './components/pdf/text';
import { ThemeProvider } from './components/pdf/theme-provider';
import { registerFont } from './components/pdf/font';
import { renderToHtml } from './components/pdf/render-to-html';
import { renderToPdf } from './components/pdf/render-to-pdf';

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
