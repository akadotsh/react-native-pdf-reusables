import type { ReactNode } from 'react';

import type { PdfStyleProp } from '../../style.js';

export type LinkProps = {
  children?: ReactNode;
  href: string;
  style?: PdfStyleProp;
};

export function Link(_props: LinkProps) {
  return null;
}
