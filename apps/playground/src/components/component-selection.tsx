import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import type { PageSize } from 'react-native-pdf-reusables';

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
  | 'linkHref'
  | 'linkLabel'
  | 'signatureLabel'
  | 'signatureName'
  | 'subtotal'
  | 'tableAmount1'
  | 'tableAmount2'
  | 'tableItem1'
  | 'tableItem2'
  | 'tableQuantity1'
  | 'tableQuantity2'
  | 'tax'
  | 'text'
  | 'total';

type ComponentSelection = {
  accentColor: string;
  content: Record<ContentField, string>;
  pagePadding: number;
  pageSize: PageSize;
  selected: Record<OptionalComponent, boolean>;
  setAccentColor: (color: string) => void;
  setContent: (field: ContentField, value: string) => void;
  setPagePadding: (padding: number) => void;
  setPageSize: (size: PageSize) => void;
  toggle: (component: OptionalComponent) => void;
};

const ComponentSelectionContext = createContext<ComponentSelection | null>(null);

export function ComponentSelectionProvider({ children }: PropsWithChildren) {
  const [accentColor, setAccentColor] = useState('#0080e8');
  const [content, setContentState] = useState({
    customer: 'Acme & Partners',
    date: '10 October 2026',
    heading: 'Basic components',
    invoice: 'INV-1042',
    linkHref: 'https://github.com/akadotsh/react-native-pdf-reusables',
    linkLabel: 'View the project source',
    signatureLabel: 'Authorized signature',
    signatureName: 'Akash Prasad',
    subtotal: 'INR 1,000',
    tableAmount1: 'INR 800',
    tableAmount2: 'INR 200',
    tableItem1: 'Consulting',
    tableItem2: 'Report',
    tableQuantity1: '2 hours',
    tableQuantity2: '1',
    tax: 'INR 180',
    text: 'A printable component gallery generated on your device.',
    total: 'INR 1,180',
  });
  const [pagePadding, setPagePadding] = useState(32);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [selected, setSelected] = useState(initialSelection);

  function setContent(field: ContentField, value: string) {
    setContentState((current) => ({ ...current, [field]: value }));
  }

  function toggle(component: OptionalComponent) {
    setSelected((current) => ({ ...current, [component]: !current[component] }));
  }

  return (
    <ComponentSelectionContext.Provider
      value={{
        accentColor,
        content,
        pagePadding,
        pageSize,
        selected,
        setAccentColor,
        setContent,
        setPagePadding,
        setPageSize,
        toggle,
      }}
    >
      {children}
    </ComponentSelectionContext.Provider>
  );
}

export function useComponentSelection() {
  const value = useContext(ComponentSelectionContext);

  if (!value) throw new Error('useComponentSelection must be used inside ComponentSelectionProvider');
  return value;
}
