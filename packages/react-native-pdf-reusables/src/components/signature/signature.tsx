import type { ReactNode } from 'react';

import type { PdfStyleProp } from '../../style.js';

export type SignatureProps = {
  children?: ReactNode;
  label?: ReactNode;
  style?: PdfStyleProp;
};

export function Signature(_props: SignatureProps) {
  return null;
}
