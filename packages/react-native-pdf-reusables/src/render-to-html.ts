import { Children, isValidElement, type ReactNode } from 'react';

import { DataTable, type DataTableProps } from './components/data-table/data-table.js';
import { Divider, type DividerProps } from './components/divider/divider.js';
import { Document, type DocumentProps } from './components/document/document.js';
import { Heading, type HeadingProps } from './components/heading/heading.js';
import { Image, type ImageProps } from './components/image/image.js';
import { KeepTogether, type KeepTogetherProps } from './components/keep-together/keep-together.js';
import {
  KeyValueList,
  type KeyValueItem,
  type KeyValueListProps,
} from './components/key-value-list/key-value-list.js';
import { Link, type LinkProps } from './components/link/link.js';
import { PageBreak } from './components/page-break/page-break.js';
import { PageFooter, type PageFooterProps } from './components/page-footer/page-footer.js';
import { PageHeader, type PageHeaderProps } from './components/page-header/page-header.js';
import { Page, type PageProps, type PageSize } from './components/page/page.js';
import { Signature, type SignatureProps } from './components/signature/signature.js';
import { Stack, type StackProps } from './components/stack/stack.js';
import { Text, type TextProps } from './components/text/text.js';
import { Totals, type TotalsProps } from './components/totals/totals.js';
import type { PdfStyle } from './style.js';

export function renderToHtml(node: ReactNode): string {
  if (!isValidElement(node)) {
    throw new TypeError('renderToHtml expects a PDF component element');
  }

  if (node.type === Document) return renderDocument(node.props as DocumentProps);
  return renderNode(node);
}

function renderDocument(props: DocumentProps): string {
  const title = props.title ? '<title>' + escapeText(props.title) + '</title>' : '';
  return (
    '<!doctype html><html><head><meta charset="utf-8">' +
    title +
    '<style>body{margin:0}[data-pdf-page]:last-child{break-after:auto}</style>' +
    '</head><body>' +
    renderChildren(props.children) +
    '</body></html>'
  );
}

function renderNode(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return escapeText(String(node));
  if (Array.isArray(node)) return node.map(renderNode).join('');
  if (!isValidElement(node)) {
    throw new TypeError('PDF components only support text and other PDF components');
  }

  if (node.type === Text) {
    const props = node.props as TextProps;
    return '<span' + styleAttribute(props.style) + '>' + renderChildren(props.children) + '</span>';
  }

  if (node.type === Heading) {
    const props = node.props as HeadingProps;
    const tag = 'h' + String(props.level ?? 1);
    return '<' + tag + styleAttribute(props.style) + '>' + renderChildren(props.children) + '</' + tag + '>';
  }

  if (node.type === Stack) {
    const props = node.props as StackProps;
    const style = { display: 'flex', flexDirection: 'column', gap: props.gap, ...props.style } satisfies PdfStyle;
    return '<div' + styleAttribute(style) + '>' + renderChildren(props.children) + '</div>';
  }

  if (node.type === KeepTogether) {
    const props = node.props as KeepTogetherProps;
    const style = { breakInside: 'avoid', pageBreakInside: 'avoid', ...props.style } satisfies PdfStyle;
    return '<div' + styleAttribute(style) + '>' + renderChildren(props.children) + '</div>';
  }

  if (node.type === KeyValueList) {
    const props = node.props as KeyValueListProps;
    return '<dl' + styleAttribute(props.style) + '>' + renderKeyValueItems(props.items) + '</dl>';
  }

  if (node.type === DataTable) {
    const props = node.props as DataTableProps<unknown>;
    const tableStyle = { borderCollapse: 'collapse', width: '100%', ...props.style } satisfies PdfStyle;
    const headers = props.columns
      .map((column) => '<th' + styleAttribute(props.headerStyle) + '>' + renderNode(column.header) + '</th>')
      .join('');
    const rows = props.rows
      .map((row, rowIndex) => {
        const cells = props.columns
          .map(
            (column) =>
              '<td' + styleAttribute(props.cellStyle) + '>' + renderNode(column.render(row, rowIndex)) + '</td>',
          )
          .join('');
        return '<tr style="break-inside:avoid;page-break-inside:avoid">' + cells + '</tr>';
      })
      .join('');
    const headerStyle = props.repeatHeader === false ? '' : ' style="display:table-header-group"';
    return (
      '<table' +
      styleAttribute(tableStyle) +
      '><thead' +
      headerStyle +
      '><tr>' +
      headers +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table>'
    );
  }

  if (node.type === Totals) {
    const props = node.props as TotalsProps;
    const style = { breakInside: 'avoid', pageBreakInside: 'avoid', ...props.style } satisfies PdfStyle;
    return '<dl data-pdf-totals' + styleAttribute(style) + '>' + renderKeyValueItems(props.items) + '</dl>';
  }

  if (node.type === PageHeader) {
    const props = node.props as PageHeaderProps;
    return '<header' + styleAttribute(props.style) + '>' + renderChildren(props.children) + '</header>';
  }

  if (node.type === PageFooter) {
    const props = node.props as PageFooterProps;
    return '<footer' + styleAttribute(props.style) + '>' + renderChildren(props.children) + '</footer>';
  }

  if (node.type === Signature) {
    const props = node.props as SignatureProps;
    const style = { breakInside: 'avoid', pageBreakInside: 'avoid', ...props.style } satisfies PdfStyle;
    return (
      '<div data-pdf-signature' +
      styleAttribute(style) +
      '><div>' +
      renderChildren(props.children) +
      '</div><div style="border-top:1px solid currentColor;margin-top:8px;padding-top:4px">' +
      renderNode(props.label) +
      '</div></div>'
    );
  }

  if (node.type === Page) {
    const props = node.props as PageProps;
    const style = { ...pageDimensions(props.size ?? 'A4'), breakAfter: 'page', ...props.style } satisfies PdfStyle;
    return '<section data-pdf-page' + styleAttribute(style) + '>' + renderChildren(props.children) + '</section>';
  }

  if (node.type === PageBreak) {
    return '<div style="break-before:page;page-break-before:always"></div>';
  }

  if (node.type === Image) {
    const props = node.props as ImageProps;
    return (
      '<img src="' +
      escapeAttribute(props.src) +
      '" alt="' +
      escapeAttribute(props.alt ?? '') +
      '"' +
      styleAttribute(props.style) +
      '>'
    );
  }

  if (node.type === Divider) {
    const props = node.props as DividerProps;
    return '<hr' + styleAttribute(props.style) + '>';
  }

  if (node.type === Link) {
    const props = node.props as LinkProps;
    return (
      '<a href="' +
      escapeAttribute(props.href) +
      '"' +
      styleAttribute(props.style) +
      '>' +
      renderChildren(props.children) +
      '</a>'
    );
  }

  throw new TypeError('Unsupported PDF component');
}

function renderChildren(children: ReactNode): string {
  return Children.toArray(children).map(renderNode).join('');
}

function renderKeyValueItems(items: readonly KeyValueItem[]): string {
  return items
    .map(
      (item) =>
        '<div style="display:flex;justify-content:space-between;gap:16px">' +
        '<dt>' +
        renderNode(item.label) +
        '</dt><dd style="margin:0">' +
        renderNode(item.value) +
        '</dd></div>',
    )
    .join('');
}

function styleAttribute(style?: PdfStyle): string {
  if (!style) return '';

  const declarations = Object.entries(style)
    .filter((entry) => entry[1] != null)
    .map(([property, value]) => {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
      const cssValue = typeof value === 'number' ? String(value) + 'px' : String(value);
      return cssProperty + ':' + escapeAttribute(cssValue).replaceAll(';', '');
    })
    .join(';');

  return declarations ? ' style="' + declarations + '"' : '';
}

function escapeText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeText(value);
}

function pageDimensions(size: PageSize): PdfStyle {
  return size === 'A4'
    ? { minHeight: '297mm', width: '210mm' }
    : { minHeight: '11in', width: '8.5in' };
}
