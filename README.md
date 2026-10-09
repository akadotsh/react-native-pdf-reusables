# React Native PDF Reusables

Source-owned, customizable PDF components for React Native and Expo.

This repository is a pnpm workspace. The publishable package lives in
`packages/react-native-pdf-reusables`. An Expo showcase will be added under
`apps/` after the component and renderer contracts are stable.

## Commands

    pnpm install
    pnpm build
    pnpm lint
    pnpm typecheck

## Current scope

- `Text`
- Typography styles
- HTML serialization with escaped text content

Every other component, PDF generation, the CLI, and the Expo showcase are
intentionally deferred until `Text` is reliable.
