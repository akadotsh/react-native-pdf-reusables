import { createContext, useContext, useState, type PropsWithChildren } from 'react';

type PdfPreview = {
  html: string;
  numberOfPages: number;
  uri: string;
};

type PdfPreviewContextValue = {
  preview?: PdfPreview;
  setPreview: (preview: PdfPreview) => void;
};

const PdfPreviewContext = createContext<PdfPreviewContextValue | null>(null);

export function PdfPreviewProvider({ children }: PropsWithChildren) {
  const [preview, setPreview] = useState<PdfPreview>();

  return (
    <PdfPreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </PdfPreviewContext.Provider>
  );
}

export function usePdfPreview() {
  const value = useContext(PdfPreviewContext);

  if (!value) throw new Error('usePdfPreview must be used inside PdfPreviewProvider');
  return value;
}
