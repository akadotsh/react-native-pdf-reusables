import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from 'fumadocs-ui/components/codeblock';

const runners = [
  ['pnpm', 'pnpm dlx'],
  ['npm', 'npx'],
  ['bun', 'bunx'],
] as const;

export function InstallCommand({ name }: { name: string }) {
  return (
    <CodeBlockTabs defaultValue="pnpm" groupId="package-manager" persist>
      <CodeBlockTabsList>
        {runners.map(([manager]) => (
          <CodeBlockTabsTrigger key={manager} value={manager}>
            {manager}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>
      {runners.map(([manager, runner]) => (
        <CodeBlockTab key={manager} value={manager}>
          <CodeBlock>
            <Pre>
              <code>{`${runner} react-native-pdf-reusables@latest add ${name}`}</code>
            </Pre>
          </CodeBlock>
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>
  );
}
