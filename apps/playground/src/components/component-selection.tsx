import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export type OptionalComponent =
  | 'details'
  | 'divider'
  | 'footer'
  | 'header'
  | 'image'
  | 'keepTogether'
  | 'link'
  | 'pageBreak'
  | 'signature'
  | 'table'
  | 'theme'
  | 'totals'
  | 'watermark';

const initialSelection: Record<OptionalComponent, boolean> = {
  details: true,
  divider: true,
  footer: true,
  header: true,
  image: true,
  keepTogether: true,
  link: true,
  pageBreak: false,
  signature: true,
  table: true,
  theme: true,
  totals: true,
  watermark: false,
};

type ComponentSelection = {
  selected: Record<OptionalComponent, boolean>;
  toggle: (component: OptionalComponent) => void;
};

const ComponentSelectionContext = createContext<ComponentSelection | null>(null);

export function ComponentSelectionProvider({ children }: PropsWithChildren) {
  const [selected, setSelected] = useState(initialSelection);

  function toggle(component: OptionalComponent) {
    setSelected((current) => ({ ...current, [component]: !current[component] }));
  }

  return (
    <ComponentSelectionContext.Provider value={{ selected, toggle }}>
      {children}
    </ComponentSelectionContext.Provider>
  );
}

export function useComponentSelection() {
  const value = useContext(ComponentSelectionContext);

  if (!value) throw new Error('useComponentSelection must be used inside ComponentSelectionProvider');
  return value;
}
