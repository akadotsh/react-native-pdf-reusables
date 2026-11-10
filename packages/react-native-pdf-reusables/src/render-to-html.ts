import { Children, isValidElement, type ComponentType, type ReactElement, type ReactNode } from 'react';

import { DataTable } from './components/data-table/data-table.js';
import { Divider } from './components/divider/divider.js';
import { Document, type DocumentProps } from './components/document/document.js';
import { Heading } from './components/heading/heading.js';
import { Image } from './components/image/image.js';
import { KeepTogether } from './components/keep-together/keep-together.js';
import { KeyValueList, type KeyValueItem } from './components/key-value-list/key-value-list.js';
import { Link } from './components/link/link.js';
import { PageBreak } from './components/page-break/page-break.js';
import { PageFooter } from './components/page-footer/page-footer.js';
import { PageHeader } from './components/page-header/page-header.js';
import { Page, type PageSize } from './components/page/page.js';
import { Signature } from './components/signature/signature.js';
import { Stack } from './components/stack/stack.js';
import { Text } from './components/text/text.js';
import { ThemeProvider } from './components/theme-provider/theme-provider.js';
import { Totals } from './components/totals/totals.js';
import { Watermark } from './components/watermark/watermark.js';
import { registeredFonts } from './font.js';
import type { PdfStyle, PdfStyleProp, PdfTheme, ThemeTokens } from './style.js';

const emptyTheme: PdfTheme = { colors: {}, fonts: {}, spacing: {} };
const unitlessProperties = new Set(['flex', 'flexGrow', 'flexShrink', 'fontWeight', 'opacity', 'order', 'zIndex']);

export function renderToHtml(node: ReactNode): string {
  if (!isComponentElement(node, Document)) {
    throw new TypeError('renderToHtml expects a PDF component element');
  }

  return renderDocument(node.props);
}

function isComponentElement<Props>(node: ReactNode, component: ComponentType<Props>): node is ReactElement<Props> {
  return isValidElement<Props>(node) && node.type === component;
}

function isBooleanNode(node: ReactNode): node is boolean {
  return typeof node === 'boolean';
}

function isTextNode(node: ReactNode): node is string | number {
  return typeof node === 'string' || typeof node === 'number';
}

function isStyleFactory(style: PdfStyleProp): style is (theme: PdfTheme) => PdfStyle {
  return typeof style === 'function';
}

function isFunctionComponentType(value: ReactElement['type']): value is React.FunctionComponent {
  return typeof value === 'function' && !(
    value.prototype && 'isReactComponent' in value.prototype && value.prototype.isReactComponent === true
  );
}

function hasComponentProps(value: unknown): value is {} {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: string | number): value is number {
  return typeof value === 'number' && Number.isFinite(value);
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
  if (node == null || isBooleanNode(node)) return '';

  if (isTextNode(node)) return escapeText(String(node));

  if (Array.isArray(node)) return node.map((child) => renderNode(child, theme)).join('');

  if (!isValidElement(node)) {
    throw new TypeError('PDF components only support text and other PDF components');
  }

  if (isComponentElement(node, ThemeProvider)) {
    const props = node.props;

    return renderChildren(props.children, mergeTheme(theme, props.tokens));
  }

  if (isComponentElement(node, Text)) {
    const props = node.props;

    return '<span' + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</span>';
  }

  if (isComponentElement(node, Heading)) {
    const props = node.props;
    const tag = 'h' + String(props.level ?? 1);

    return (
      '<' + tag + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</' + tag + '>'
    );
  }

  if (isComponentElement(node, Stack)) {
    const props = node.props;
    const style = mergeStyle({ display: 'flex', flexDirection: 'column', gap: props.gap }, props.style, theme);

    return '<div' + styleAttribute(style, theme) + '>' + renderChildren(props.children, theme) + '</div>';
  }

  if (isComponentElement(node, KeepTogether)) {
    const props = node.props;
    const style = mergeStyle({ breakInside: 'avoid', pageBreakInside: 'avoid' }, props.style, theme);

    return '<div' + styleAttribute(style, theme) + '>' + renderChildren(props.children, theme) + '</div>';
  }

  if (isComponentElement(node, KeyValueList)) {
    const props = node.props;

    return '<dl' + styleAttribute(props.style, theme) + '>' + renderKeyValueItems(props.items, theme) + '</dl>';
  }

  if (isComponentElement(node, DataTable)) {
    const props = node.props;
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

  if (isComponentElement(node, Totals)) {
    const props = node.props;
    const style = mergeStyle({ breakInside: 'avoid', pageBreakInside: 'avoid' }, props.style, theme);

    return '<dl data-pdf-totals' + styleAttribute(style, theme) + '>' + renderKeyValueItems(props.items, theme) + '</dl>';
  }

  if (isComponentElement(node, PageHeader)) {
    const props = node.props;

    return '<header' + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</header>';
  }

  if (isComponentElement(node, PageFooter)) {
    const props = node.props;

    return '<footer' + styleAttribute(props.style, theme) + '>' + renderChildren(props.children, theme) + '</footer>';
  }

  if (isComponentElement(node, Signature)) {
    const props = node.props;
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

  if (isComponentElement(node, Watermark)) {
    const props = node.props;

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

  if (isComponentElement(node, Page)) {
    const props = node.props;
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

  if (isComponentElement(node, Image)) {
    const props = node.props;

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

  if (isComponentElement(node, Divider)) {
    const props = node.props;

    return '<hr' + styleAttribute(props.style, theme) + '>';
  }

  if (isComponentElement(node, Link)) {
    const props = node.props;

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

  if (isFunctionComponentType(node.type)) {
    if (!hasComponentProps(node.props)) throw new TypeError('PDF components require object props');

    // shortcut: composite components must be pure functions without hooks, add a custom reconciler when hooks are needed.
    const rendered = node.type(node.props);

    if (rendered instanceof Promise) throw new TypeError('Async components are not supported in PDF documents');

    return renderNode(rendered, theme);
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

  const declarations = Object.entries(expandSpacing(isStyleFactory(style) ? style(theme) : style))
    .filter((entry) => entry[1] != null)
    .map(([property, value]) => {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
      const cssValue = (isFiniteNumber(value) && !unitlessProperties.has(property)) ? String(value) + 'px' : String(value);

      return cssProperty + ':' + escapeAttribute(cssValue).replaceAll(';', '');
    })
    .join(';');

  return declarations ? ' style="' + declarations + '"' : '';
}

function mergeStyle(defaults: PdfStyle, style: PdfStyleProp | undefined, theme: PdfTheme): PdfStyle {
  return { ...defaults, ...(style && isStyleFactory(style) ? style(theme) : style) };
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
