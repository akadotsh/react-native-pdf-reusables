import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { CSSProperties } from 'react';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      containerProps={{
        style: { '--fd-layout-width': '100vw' } as CSSProperties,
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
