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
import { ThemeProvider, type ThemeProviderProps } from './components/theme-provider/theme-provider.js';
import { Totals, type TotalsProps } from './components/totals/totals.js';
import { Watermark, type WatermarkProps } from './components/watermark/watermark.js';
import { registeredFonts } from './font.js';
import type { PdfStyle, PdfStyleProp, PdfTheme, ThemeTokens } from './style.js';

const emptyTheme: PdfTheme = { colors: {}, fonts: {}, spacing: {} };
const unitlessProperties = new Set(['flex', 'flexGrow', 'flexShrink', 'fontWeight', 'opacity', 'order', 'zIndex']);

export function renderToHtml(node: ReactNode): string {
  if (!isValidElement(node)) {
    throw new TypeError('renderToHtml expects a PDF component element');
  }

  if (node.type === Document) return renderDocument(node.props as DocumentProps);
  return renderNode(node, emptyTheme);
}

function renderDocument(props: DocumentProps): string {
  const title = props.title ? '<title>' + escapeText(props.title) + '</title>' : '';
  return (
    '<!doctype html><html><head><meta charset="utf-8">' +
    title +
    '<style>' +
    renderFontFaces() +
    'body{margin:0}[data-pdf-page]:last-child{break-after:auto}</style>' +
    '</head><body>' +
    renderChildren(props.children, emptyTheme) +
    '</body></html>'
  );
}

function renderNode(node: ReactNode, theme: PdfTheme): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return escapeText(String(node));
  if (Array.isArray(node)) return node.map((child) => renderNode(child, theme)).join('');
  if (!isValidElement(node)) {
    throw new TypeError('PDF components only support text and other PDF components');
  }

  if (node.type === ThemeProvider) {
    const props = node.props as ThemeProviderProps;
    return renderChildren(props.children, mergeTheme(theme, props.tokens));
  }

  if (node.type === Text) {
    const props = node.props as TextProps;
    return '<span' + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</span>';
  }

  if (node.type === Heading) {
    const props = node.props as HeadingProps;
    const tag = 'h' + String(props.level ?? 1);
    return (
      '<' + tag + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</' + tag + '>'
    );
  }

  if (node.type === Stack) {
    const props = node.props as StackProps;
    const style = mergeStyle({ display: 'flex', flexDirection: 'column', gap: props.gap }, props.style, theme);
    return '<div' + styleAttribute(style, theme) + '>' + renderChildren(props.children, theme) + '</div>';
  }

  if (node.type === KeepTogether) {
    const props = node.props as KeepTogetherProps;
    const style = mergeStyle({ breakInside: 'avoid', pageBreakInside: 'avoid' }, props.style, theme);
    return '<div' + styleAttribute(style, theme) + '>' + renderChildren(props.children, theme) + '</div>';
  }

  if (node.type === KeyValueList) {
    const props = node.props as KeyValueListProps;
    return '<dl' + styleAttribute(props.style, theme) + '>' + renderKeyValueItems(props.items, theme) + '</dl>';
  }

  if (node.type === DataTable) {
    const props = node.props as DataTableProps<unknown>;
    const tableStyle = mergeStyle({ borderCollapse: 'collapse', width: '100%' }, props.style, theme);
    const headers = props.columns
      .map(
        (column) =>
          '<th' + styleAttribute(props.headerStyle, theme) + '>' + renderNode(column.header, theme) + '</th>',
      )
      .join('');
    const rows = props.rows
      .map((row, rowIndex) => {
        const cells = props.columns
          .map(
            (column) =>
              '<td' +
              styleAttribute(props.cellStyle, theme) +
              '>' +
              renderNode(column.render(row, rowIndex), theme) +
              '</td>',
          )
          .join('');
        return '<tr style="break-inside:avoid;page-break-inside:avoid">' + cells + '</tr>';
      })
      .join('');
    const headerStyle = props.repeatHeader === false ? '' : ' style="display:table-header-group"';
    return (
      '<table' +
      styleAttribute(tableStyle, theme) +
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
    const style = mergeStyle({ breakInside: 'avoid', pageBreakInside: 'avoid' }, props.style, theme);
    return '<dl data-pdf-totals' + styleAttribute(style, theme) + '>' + renderKeyValueItems(props.items, theme) + '</dl>';
  }

  if (node.type === PageHeader) {
    const props = node.props as PageHeaderProps;
    return '<header' + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</header>';
  }

  if (node.type === PageFooter) {
    const props = node.props as PageFooterProps;
    return '<footer' + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</footer>';
  }

  if (node.type === Signature) {
    const props = node.props as SignatureProps;
    const style = mergeStyle({ breakInside: 'avoid', pageBreakInside: 'avoid' }, props.style, theme);
    return (
      '<div data-pdf-signature' +
      styleAttribute(style, theme) +
      '><div>' +
      renderChildren(props.children, theme) +
      '</div><div style="border-top:1px solid currentColor;margin-top:8px;padding-top:4px">' +
      renderNode(props.label, theme) +
      '</div></div>'
    );
  }

  if (node.type === Watermark) {
    const props = node.props as WatermarkProps;
    const style = mergeStyle(
      {
        left: '50%',
        opacity: 0.12,
        pointerEvents: 'none',
        position: 'fixed',
        top: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
      },
      props.style,
      theme,
    );
    return (
      '<div data-pdf-watermark' +
      styleAttribute(style, theme) +
      '>' +
      renderChildren(props.children, theme) +
      '</div>'
    );
  }

  if (node.type === Page) {
    const props = node.props as PageProps;
    const style = mergeStyle({ ...pageDimensions(props.size ?? 'A4'), breakAfter: 'page' }, props.style, theme);
    return (
      '<section data-pdf-page' +
      styleAttribute(style, theme) +
      '>' +
      renderChildren(props.children, theme) +
      '</section>'
    );
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
      styleAttribute(props.style, theme) +
      '>'
    );
  }

  if (node.type === Divider) {
    const props = node.props as DividerProps;
    return '<hr' + styleAttribute(props.style, theme) + '>';
  }

  if (node.type === Link) {
    const props = node.props as LinkProps;
    return (
      '<a href="' +
      escapeAttribute(props.href) +
      '"' +
      styleAttribute(props.style, theme) +
      '>' +
      renderChildren(props.children, theme) +
      '</a>'
    );
  }

  if (typeof node.type === 'function') {
    const component = node.type as unknown as {
      (props: unknown): ReactNode;
      prototype?: { isReactComponent?: unknown };
    };
    if (component.prototype?.isReactComponent) {
      throw new TypeError('Class components are not supported in PDF documents');
    }

    // shortcut: composite components must be pure functions without hooks, add a custom reconciler when hooks are needed.
    return renderNode(component(node.props), theme);
  }

  throw new TypeError('Unsupported PDF component');
}

function renderChildren(children: ReactNode, theme: PdfTheme): string {
  return Children.toArray(children)
    .map((child) => renderNode(child, theme))
    .join('');
}

function renderKeyValueItems(items: readonly KeyValueItem[], theme: PdfTheme): string {
  return items
    .map(
      (item) =>
        '<div style="display:flex;justify-content:space-between;gap:16px">' +
        '<dt>' +
        renderNode(item.label, theme) +
        '</dt><dd style="margin:0">' +
        renderNode(item.value, theme) +
        '</dd></div>',
    )
    .join('');
}

function styleAttribute(style: PdfStyleProp | undefined, theme: PdfTheme): string {
  if (!style) return '';

  const declarations = Object.entries(expandSpacing(typeof style === 'function' ? style(theme) : style))
    .filter((entry) => entry[1] != null)
    .map(([property, value]) => {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
      const cssValue = typeof value === 'number' && !unitlessProperties.has(property) ? String(value) + 'px' : String(value);
      return cssProperty + ':' + escapeAttribute(cssValue).replaceAll(';', '');
    })
    .join(';');

  return declarations ? ' style="' + declarations + '"' : '';
}

function mergeStyle(defaults: PdfStyle, style: PdfStyleProp | undefined, theme: PdfTheme): PdfStyle {
  return { ...defaults, ...(typeof style === 'function' ? style(theme) : style) };
}

function mergeTheme(theme: PdfTheme, tokens: ThemeTokens): PdfTheme {
  return {
    colors: { ...theme.colors, ...tokens.colors },
    fonts: { ...theme.fonts, ...tokens.fonts },
    spacing: { ...theme.spacing, ...tokens.spacing },
  };
}

function expandSpacing(style: PdfStyle): PdfStyle {
  const expanded = { ...style };

  if (style.marginHorizontal != null) {
    expanded.marginLeft ??= style.marginHorizontal;
    expanded.marginRight ??= style.marginHorizontal;
    delete expanded.marginHorizontal;
  }
  if (style.marginVertical != null) {
    expanded.marginBottom ??= style.marginVertical;
    expanded.marginTop ??= style.marginVertical;
    delete expanded.marginVertical;
  }
  if (style.paddingHorizontal != null) {
    expanded.paddingLeft ??= style.paddingHorizontal;
    expanded.paddingRight ??= style.paddingHorizontal;
    delete expanded.paddingHorizontal;
  }
  if (style.paddingVertical != null) {
    expanded.paddingBottom ??= style.paddingVertical;
    expanded.paddingTop ??= style.paddingVertical;
    delete expanded.paddingVertical;
  }

  return expanded;
}

function renderFontFaces(): string {
  return Array.from(registeredFonts(), (font) => {
    const family = escapeCssString(font.family);
    const src = escapeCssString(font.src);
    return (
      '@font-face{font-family:"' +
      family +
      '";src:url("' +
      src +
      '");font-style:' +
      (font.style ?? 'normal') +
      ';font-weight:' +
      String(font.weight ?? 'normal') +
      '}'
    );
  }).join('');
}

function escapeCssString(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\a ').replaceAll('<', '\\3c ');
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
