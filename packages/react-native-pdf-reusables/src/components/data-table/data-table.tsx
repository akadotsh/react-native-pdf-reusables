import type { ReactNode } from 'react';

import type { PdfStyle } from '../../style.js';

export type DataTableColumn<Row> = {
  header: ReactNode;
  render: (row: Row, index: number) => ReactNode;
};

export type DataTableProps<Row> = {
  cellStyle?: PdfStyle;
  columns: readonly DataTableColumn<Row>[];
  headerStyle?: PdfStyle;
  repeatHeader?: boolean;
  rows: readonly Row[];
  style?: PdfStyle;
};

export function DataTable<Row>(_props: DataTableProps<Row>) {
  return null;
}
