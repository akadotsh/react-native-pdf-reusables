import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type DocumentPreviewProps = {
  html: string;
};

export function DocumentPreview({ html }: DocumentPreviewProps) {
  const previewHtml = html.replace(
    '<head>',
    '<head><meta name="viewport" content="width=794"><style>@media screen{body{background:#d8d5d0;padding:16px}[data-pdf-page]{background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12);box-sizing:border-box}}</style>',
  );

  return (
    <View style={styles.frame}>
      <WebView
        allowFileAccess
        originWhitelist={['*']}
        source={{ html: previewHtml }}
        style={styles.webView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
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
