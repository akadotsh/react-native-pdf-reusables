import { Children, isValidElement, type ReactNode } from 'react';

import type { PdfStyle } from './components/text/style.js';
import { Text, type TextProps } from './components/text/text.js';

export function renderToHtml(node: ReactNode): string {
  if (!isValidElement(node) || node.type !== Text) {
    throw new TypeError('renderToHtml expects a Text element');
  }

  return renderNode(node);
}

function renderNode(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return escapeText(String(node));
  if (Array.isArray(node)) return node.map(renderNode).join('');
  if (!isValidElement(node) || node.type !== Text) {
    throw new TypeError('Text only supports text and nested Text children');
  }

  const props = node.props as TextProps;
  return '<span' + styleAttribute(props.style) + '>' + renderChildren(props.children) + '</span>';
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
      return cssProperty + ':' + escapeAttribute(cssValue);
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
  return escapeText(value).replaceAll(';', '');
}
