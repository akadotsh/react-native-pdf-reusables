import type { ReactNode } from 'react';

import type { PdfStyle } from '../../style.js';

export type LinkProps = {
  children?: ReactNode;
  href: string;
  style?: PdfStyle;
};

export function Link(_props: LinkProps) {
  return null;
}
