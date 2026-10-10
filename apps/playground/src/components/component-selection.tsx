import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export type OptionalComponent =
  | 'details'
  | 'divider'
  | 'image'
  | 'link'
  | 'signature'
  | 'table'
  | 'totals';

const initialSelection: Record<OptionalComponent, boolean> = {
  details: true,
  divider: true,
  image: true,
  link: true,
  signature: true,
  table: true,
  totals: true,
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
