import type { ReactNode } from 'react';

import type { PdfStyle } from '../../style.js';

export type HeadingProps = {
  children?: ReactNode;
  level?: 1 | 2 | 3;
  style?: PdfStyle;
};

export function Heading(_props: HeadingProps) {
  return null;
}
