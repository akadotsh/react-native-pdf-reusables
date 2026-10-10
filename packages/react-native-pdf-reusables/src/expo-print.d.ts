declare module 'expo-print' {
  export function printToFileAsync(options: { html: string }): Promise<{
    numberOfPages: number;
    uri: string;
  }>;
}
