import type { ReactNode } from 'react';

import { renderToHtml } from './render-to-html.js';

export type PdfResult = {
  numberOfPages: number;
  uri: string;
};

export async function renderToPdf(node: ReactNode): Promise<PdfResult> {
  let print: typeof import('expo-print');

  try {
    print = await import('expo-print');
  } catch (error) {
    throw new Error('renderToPdf requires expo-print. Install it with npx expo install expo-print.', {
      cause: error,
    });
  }

  const result = await print.printToFileAsync({ html: renderToHtml(node) });
  return { numberOfPages: result.numberOfPages, uri: result.uri };
}
