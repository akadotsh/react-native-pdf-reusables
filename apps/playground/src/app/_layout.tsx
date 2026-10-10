import { Stack } from 'expo-router';

import { ComponentSelectionProvider } from '../components/component-selection';

export default function RootLayout() {
  return (
    <ComponentSelectionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: 'PDF Reusables Playground' }} />
        <Stack.Screen name="behavior" options={{ headerTitle: 'PDF behavior' }} />
        <Stack.Screen
          name="components"
          options={{
            contentStyle: { backgroundColor: '#f2f0ec' },
            gestureEnabled: false,
            headerShown: false,
            presentation: 'formSheet',
            sheetAllowedDetents: [0.68],
            sheetCornerRadius: 28,
            sheetGrabberVisible: false,
            sheetInitialDetentIndex: 0,
          }}
        />
      </Stack>
    </ComponentSelectionProvider>
  );
}
