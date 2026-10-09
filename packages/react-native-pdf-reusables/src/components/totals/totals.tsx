import type { KeyValueItem } from '../key-value-list/key-value-list.js';
import type { PdfStyle } from '../../style.js';

export type TotalsProps = {
  items: readonly KeyValueItem[];
  style?: PdfStyle;
};

export function Totals(_props: TotalsProps) {
  return null;
}
