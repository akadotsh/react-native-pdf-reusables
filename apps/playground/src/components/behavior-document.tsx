import {
  DataTable,
  Document,
  Heading,
  Image,
  KeepTogether,
  Page,
  PageBreak,
  PageFooter,
  PageHeader,
  Stack,
  Text,
  Watermark,
} from 'react-native-pdf-reusables';

const embeddedImage =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNjQiPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iNjQiIHJ4PSIxNCIgZmlsbD0iI2U4ZjVlOSIvPjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE4IiBmaWxsPSIjMTZhMzRhIi8+PHBhdGggZD0ibTIzIDMyIDYgNiAxMi0xNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iNSIvPjx0ZXh0IHg9IjYwIiB5PSIzOCIgZmlsbD0iIzQ3NDY0NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI1MDAiPkJBU0U2NDwvdGV4dD48L3N2Zz4=';

const rows = Array.from({ length: 48 }, (_, index) => ({
  amount: `INR ${(index + 1) * 125}`,
  item: `Validation row ${String(index + 1).padStart(2, '0')}`,
  quantity: String((index % 4) + 1),
}));

type BehaviorDocumentProps = {
  localImageUri: string;
};

export function BehaviorDocument({ localImageUri }: BehaviorDocumentProps) {
  return (
    <Document title="PDF behavior validation">
      <Page
        size="A4"
        style={{
          color: '#474645',
          fontSize: 12,
          paddingBottom: 64,
          paddingHorizontal: 32,
          paddingTop: 64,
        }}
      >
        <Watermark style={{ fontSize: 64, fontWeight: 'bold' }}>VALIDATION</Watermark>
        <PageHeader
          style={{
            borderBottomColor: '#d6d3d1',
            borderBottomWidth: 1,
            left: 32,
            paddingBottom: 8,
            position: 'fixed',
            right: 32,
            top: 24,
          }}
        >
          <Text>React Native PDF Reusables - behavior validation</Text>
        </PageHeader>
        <PageFooter
          style={{
            borderTopColor: '#d6d3d1',
            borderTopWidth: 1,
            bottom: 24,
            left: 32,
            paddingTop: 8,
            position: 'fixed',
            right: 32,
          }}
        >
          <Text style={{ color: '#7a7876', fontSize: 10 }}>Header, footer, table, pagination, and image check</Text>
        </PageFooter>

        <Stack gap={18}>
          <Stack gap={6}>
            <Heading style={{ margin: 0 }}>Multi-page behavior</Heading>
            <Text>
              This document intentionally crosses page boundaries so renderer differences are easy to spot.
            </Text>
          </Stack>

          <Stack gap={8}>
            <Heading level={2} style={{ margin: 0 }}>Image sources</Heading>
            <Stack gap={12} style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Image alt="Bundled local asset" src={localImageUri} style={{ height: 48, width: 120 }} />
              <Image alt="Embedded base64 asset" src={embeddedImage} style={{ height: 48, width: 120 }} />
            </Stack>
          </Stack>

          <Stack gap={8}>
            <Heading level={2} style={{ margin: 0 }}>Repeated table header</Heading>
            <DataTable
              cellStyle={{ borderBottomColor: '#e7e5e4', borderBottomWidth: 1, padding: 7 }}
              columns={[
                { header: 'Item', render: (row) => row.item },
                { header: 'Quantity', render: (row) => row.quantity },
                { header: 'Amount', render: (row) => row.amount },
              ]}
              headerStyle={{ backgroundColor: '#e3f2fd', padding: 8, textAlign: 'left' }}
              repeatHeader
              rows={rows}
            />
          </Stack>

          <PageBreak />

          <Heading style={{ margin: 0 }}>Forced page break</Heading>
          <Text>This heading must begin on a new page.</Text>

          <KeepTogether
            style={{
              backgroundColor: '#f2f0ec',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <Heading level={2} style={{ margin: 0 }}>KeepTogether block</Heading>
            <Text>
              This entire card should move to the following page when there is not enough remaining space.
            </Text>
            <Text>Line one - Line two - Line three - Line four</Text>
          </KeepTogether>
        </Stack>
      </Page>
    </Document>
  );
}
