import type { ReactNode } from 'react';

import type { PdfStyle } from '../../style.js';

export type PageSize = 'A4' | 'Letter';

export type PageProps = {
  children?: ReactNode;
  size?: PageSize;
  style?: PdfStyle;
};

export function Page(_props: PageProps) {
  return null;
}
