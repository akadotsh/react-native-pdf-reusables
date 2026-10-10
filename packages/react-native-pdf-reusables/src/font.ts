import type { PdfFontWeight } from './style.js';

export type PdfFont = {
  family: string;
  src: string;
  style?: 'normal' | 'italic';
  weight?: PdfFontWeight;
};

const fonts = new Map<string, PdfFont>();

export function registerFont(font: PdfFont): void {
  if (!font.family.trim() || !font.src.trim()) {
    throw new TypeError('registerFont requires a non-empty family and src');
  }
  if (font.style != null && font.style !== 'normal' && font.style !== 'italic') {
    throw new TypeError('registerFont style must be normal or italic');
  }
  if (
    font.weight != null &&
    font.weight !== 'normal' &&
    font.weight !== 'bold' &&
    (typeof font.weight !== 'number' || !Number.isFinite(font.weight) || font.weight < 1 || font.weight > 1000)
  ) {
    throw new TypeError('registerFont weight must be normal, bold, or a number from 1 to 1000');
  }

  fonts.set([font.family, font.style ?? 'normal', font.weight ?? 'normal'].join('\0'), font);
}

export function registeredFonts(): Iterable<PdfFont> {
  return fonts.values();
}
