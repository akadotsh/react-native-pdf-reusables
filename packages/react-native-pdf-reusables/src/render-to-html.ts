import { Children, isValidElement, type ReactNode } from 'react';

import { Divider, type DividerProps } from './components/divider/divider.js';
import { Document, type DocumentProps } from './components/document/document.js';
import { Heading, type HeadingProps } from './components/heading/heading.js';
import { Image, type ImageProps } from './components/image/image.js';
import { KeepTogether, type KeepTogetherProps } from './components/keep-together/keep-together.js';
import { Link, type LinkProps } from './components/link/link.js';
import { PageBreak } from './components/page-break/page-break.js';
import { Page, type PageProps, type PageSize } from './components/page/page.js';
import { Stack, type StackProps } from './components/stack/stack.js';
import { Text, type TextProps } from './components/text/text.js';
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
