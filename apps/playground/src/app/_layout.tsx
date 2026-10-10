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
            sheetAllowedDetents: 'fitToContents',
            sheetCornerRadius: 28,
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
    </ComponentSelectionProvider>
  );
}
