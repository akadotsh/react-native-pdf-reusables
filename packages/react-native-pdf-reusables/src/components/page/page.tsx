import type { ReactNode } from 'react';

import type { PdfStyleProp } from '../../style.js';

export type PageSize = 'A4' | 'Letter';

export type PageProps = {
  children?: ReactNode;
  size?: PageSize;
  style?: PdfStyleProp;
};

export function Page(_props: PageProps) {
  return null;
}
