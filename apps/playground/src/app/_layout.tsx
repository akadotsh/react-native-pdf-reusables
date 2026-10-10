import { Stack } from 'expo-router';

import { ComponentSelectionProvider } from '../components/component-selection';

export default function RootLayout() {
  return (
    <ComponentSelectionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: 'PDF Reusables Playground' }} />
        <Stack.Screen
          name="components"
          options={{
            contentStyle: { backgroundColor: '#f2f0ec' },
            headerShown: false,
            presentation: 'formSheet',
            sheetAllowedDetents: [0.65, 0.9],
            sheetCornerRadius: 28,
            sheetExpandsWhenScrolledToEdge: false,
            sheetGrabberVisible: true,
            sheetInitialDetentIndex: 0,
          }}
        />
      </Stack>
    </ComponentSelectionProvider>
  );
}
