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

type ContentField =
  | 'customer'
  | 'date'
  | 'heading'
  | 'invoice'
  | 'subtotal'
  | 'tax'
  | 'text'
  | 'total';

type ComponentSelection = {
  content: Record<ContentField, string>;
  selected: Record<OptionalComponent, boolean>;
  setContent: (field: ContentField, value: string) => void;
  toggle: (component: OptionalComponent) => void;
};

const ComponentSelectionContext = createContext<ComponentSelection | null>(null);

export function ComponentSelectionProvider({ children }: PropsWithChildren) {
  const [content, setContentState] = useState({
    customer: 'Acme & Partners',
    date: '10 October 2026',
    heading: 'Basic components',
    invoice: 'INV-1042',
    subtotal: 'INR 1,000',
    tax: 'INR 180',
    text: 'A printable component gallery generated on your device.',
    total: 'INR 1,180',
  });
  const [selected, setSelected] = useState(initialSelection);

  function setContent(field: ContentField, value: string) {
    setContentState((current) => ({ ...current, [field]: value }));
  }

  function toggle(component: OptionalComponent) {
    setSelected((current) => ({ ...current, [component]: !current[component] }));
  }

  return (
    <ComponentSelectionContext.Provider value={{ content, selected, setContent, toggle }}>
      {children}
    </ComponentSelectionContext.Provider>
  );
}

export function useComponentSelection() {
  const value = useContext(ComponentSelectionContext);

  if (!value) throw new Error('useComponentSelection must be used inside ComponentSelectionProvider');
  return value;
}
