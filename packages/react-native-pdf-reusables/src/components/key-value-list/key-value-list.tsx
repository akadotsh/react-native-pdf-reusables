import type { ReactNode } from 'react';

import type { PdfStyleProp } from '../../style.js';

export type KeyValueItem = {
  label: ReactNode;
  value: ReactNode;
};

export type KeyValueListProps = {
  items: readonly KeyValueItem[];
  style?: PdfStyleProp;
};

export function KeyValueList(_props: KeyValueListProps) {
  return null;
}
