This is a pnpm workspace for a React Native PDF component library.

## Structure

- `packages/react-native-pdf-reusables` is the publishable npm package.
- `apps/` is reserved for future example and showcase applications.
- Keep the CLI and renderer in the main package until a separate package boundary is necessary.

## Commands

Run these from the workspace root:

    pnpm build
    pnpm lint
    pnpm typecheck

Run lint and typecheck before declaring a task done.

## Library rules

- Export public API only through `packages/react-native-pdf-reusables/src/index.ts`.
- Keep React as a peer dependency.
- PDF primitives describe printable documents and must not render ordinary React Native views.
- Escape application text before including it in generated HTML.
- Do not add templates, a registry, or extra packages before their underlying primitives work.

## Future Expo apps

Before code in `apps/` touches an Expo, EAS, or React Native API:

1. Read the major version of its `expo` dependency.
2. Fetch `https://docs.expo.dev/versions/v<major>.0.0/`.
3. Fetch `https://docs.expo.dev/llms.txt` and follow its links to the relevant page.

Use `npx expo install` for Expo app dependencies. Keep routes in the app's
`src/app/` directory, use Expo Router for navigation, and never hand-edit
generated `ios/` or `android/` directories.
