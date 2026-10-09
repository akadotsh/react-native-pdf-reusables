import type { ReactNode } from 'react';

import type { PdfStyle } from '../../style.js';

export type KeyValueItem = {
  label: ReactNode;
  value: ReactNode;
};

export type KeyValueListProps = {
  items: readonly KeyValueItem[];
  style?: PdfStyle;
};

export function KeyValueList(_props: KeyValueListProps) {
  return null;
}
