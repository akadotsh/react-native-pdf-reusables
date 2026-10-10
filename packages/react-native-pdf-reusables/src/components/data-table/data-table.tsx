import type { ReactNode } from 'react';

import type { PdfStyleProp } from '../../style.js';

export type DataTableColumn<Row> = {
  header: ReactNode;
  render: (row: Row, index: number) => ReactNode;
};

export type DataTableProps<Row> = {
  cellStyle?: PdfStyleProp;
  columns: readonly DataTableColumn<Row>[];
  headerStyle?: PdfStyleProp;
  repeatHeader?: boolean;
  rows: readonly Row[];
  style?: PdfStyleProp;
};

export function DataTable<Row>(_props: DataTableProps<Row>) {
  return null;
}
