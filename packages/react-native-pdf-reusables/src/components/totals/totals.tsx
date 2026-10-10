import type { KeyValueItem } from '../key-value-list/key-value-list.js';
import type { PdfStyleProp } from '../../style.js';

export type TotalsProps = {
  items: readonly KeyValueItem[];
  style?: PdfStyleProp;
};

export function Totals(_props: TotalsProps) {
  return null;
}
