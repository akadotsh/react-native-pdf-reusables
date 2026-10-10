import type { ReactNode } from 'react';

import type { PdfStyleProp } from '../../style.js';

export type HeadingProps = {
  children?: ReactNode;
  level?: 1 | 2 | 3;
  style?: PdfStyleProp;
};

export function Heading(_props: HeadingProps) {
  return null;
}
