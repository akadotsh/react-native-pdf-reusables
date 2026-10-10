import type { ReactNode } from 'react';

import type { ThemeTokens } from '../../style.js';

export type ThemeProviderProps = {
  children?: ReactNode;
  tokens: ThemeTokens;
};

export function ThemeProvider(_props: ThemeProviderProps) {
  return null;
}
