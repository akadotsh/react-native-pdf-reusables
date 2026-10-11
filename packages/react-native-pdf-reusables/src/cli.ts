#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type RegistryEntry = {
  dependencies?: readonly string[];
  destination?: string;
  source?: string;
};

const components = [
  'data-table',
  'divider',
  'document',
  'heading',
  'image',
  'keep-together',
  'key-value-list',
  'link',
  'page',
  'page-break',
  'page-footer',
  'page-header',
  'signature',
  'stack',
  'text',
  'theme-provider',
  'totals',
  'watermark',
] as const;

const styledComponents = new Set<string>(components.filter((name) => name !== 'document' && name !== 'page-break'));
const registry: Record<string, RegistryEntry> = Object.fromEntries(
  components.map((name) => [
    name,
    {
      dependencies: name === 'totals' ? ['key-value-list', 'style'] : styledComponents.has(name) ? ['style'] : [],
      destination: `${name}.tsx`,
      source: `components/${name}/${name}.tsx`,
    },
  ]),
);

Object.assign(registry, {
  font: { dependencies: ['style'], destination: 'font.ts', source: 'font.ts' },
  renderer: { dependencies: ['render-to-pdf'] },
  'render-to-html': {
    dependencies: [...components, 'font', 'style'],
    destination: 'render-to-html.ts',
    source: 'render-to-html.ts',
  },
  'render-to-pdf': {
    dependencies: ['render-to-html'],
    destination: 'render-to-pdf.ts',
    source: 'render-to-pdf.ts',
  },
  style: { destination: 'style.ts', source: 'style.ts' },
});

const publicEntries = [...components, 'renderer'];

type AddOptions = {
  cwd: string;
  names: string[];
  overwrite: boolean;
  target?: string;
};

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    printHelp();
    return;
  }
  if (args.includes('--version') || args.includes('-v')) {
    const packageJson = JSON.parse(await readFile(resolve(packageRoot(), 'package.json'), 'utf8')) as { version: string };
    console.log(packageJson.version);
    return;
  }
  if (args[0] !== 'add') throw new Error(`Unknown command "${args[0]}". Run with --help for usage.`);

  await add(parseAddOptions(args.slice(1)));
}

function parseAddOptions(args: string[]): AddOptions {
  const options: AddOptions = { cwd: process.cwd(), names: [], overwrite: false };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--overwrite') {
      options.overwrite = true;
    } else if (argument === '--cwd' || argument === '--path') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) throw new Error(`${argument} requires a value.`);
      if (argument === '--cwd') options.cwd = resolve(value);
      else options.target = value;
      index += 1;
    } else if (argument?.startsWith('-')) {
      throw new Error(`Unknown option "${argument}".`);
    } else if (argument) {
      options.names.push(argument);
    }
  }

  if (options.names.length === 0) throw new Error('Add at least one component name.');
  const unknown = options.names.filter((name) => !publicEntries.includes(name as (typeof publicEntries)[number]));
  if (unknown.length > 0) {
    throw new Error(`Unknown component${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}\nAvailable: ${publicEntries.join(', ')}`);
  }
  return options;
}

async function add(options: AddOptions) {
  await readProjectPackage(options.cwd);
  const defaultTarget = (await pathExists(resolve(options.cwd, 'src'))) ? 'src/components/pdf' : 'components/pdf';
  const target = options.target ?? defaultTarget;
  if (isAbsolute(target)) throw new Error('--path must be relative to the project directory.');

  const targetRoot = resolve(options.cwd, target);
  const relativeTarget = relative(options.cwd, targetRoot);
  if (relativeTarget === '..' || relativeTarget.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)) {
    throw new Error('--path must stay inside the project directory.');
  }

  const entries = resolveEntries(options.names);
  const plans = await Promise.all(
    entries.map(async ([name, entry]) => {
      const source = resolve(packageRoot(), 'src', entry.source!);
      const destination = resolve(targetRoot, entry.destination!);
      return { content: rewriteImports(await readFile(source, 'utf8'), entry), destination, name };
    }),
  );

  const conflicts: string[] = [];
  const writes: typeof plans = [];
  const unchanged: string[] = [];
  for (const plan of plans) {
    try {
      const current = await readFile(plan.destination, 'utf8');
      if (current === plan.content) unchanged.push(plan.name);
      else if (options.overwrite) writes.push(plan);
      else conflicts.push(relative(options.cwd, plan.destination));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      writes.push(plan);
    }
  }

  if (conflicts.length > 0) {
    throw new Error(`Refusing to replace existing files:\n${conflicts.map((file) => `  ${file}`).join('\n')}\nRun again with --overwrite to replace them.`);
  }

  for (const plan of writes) {
    await mkdir(dirname(plan.destination), { recursive: true });
    await writeFile(plan.destination, plan.content);
  }

  if (writes.length > 0) {
    console.log(`Added ${writes.length} file${writes.length === 1 ? '' : 's'} to ${relative(options.cwd, targetRoot)}:`);
    for (const plan of writes) console.log(`  ${relative(targetRoot, plan.destination)}`);
  }
  if (unchanged.length > 0) console.log(`Unchanged: ${unchanged.join(', ')}`);
}

function resolveEntries(names: readonly string[]) {
  const resolved: Array<[string, Required<Pick<RegistryEntry, 'destination' | 'source'>> & RegistryEntry]> = [];
  const visited = new Set<string>();

  function visit(name: string) {
    if (visited.has(name)) return;
    visited.add(name);
    const entry = registry[name];
    if (!entry) throw new Error(`Registry entry "${name}" is missing.`);
    for (const dependency of entry.dependencies ?? []) visit(dependency);
    if (entry.source && entry.destination) resolved.push([name, { ...entry, destination: entry.destination, source: entry.source }]);
  }

  for (const name of names) visit(name);
  return resolved;
}

function rewriteImports(content: string, entry: RegistryEntry): string {
  const sourceDirectory = dirname(entry.source!);
  const destinationDirectory = dirname(entry.destination!);
  const sourceToDestination = new Map(
    Object.values(registry)
      .filter((item): item is RegistryEntry & { destination: string; source: string } => Boolean(item.source && item.destination))
      .map((item) => [stripExtension(item.source), item.destination]),
  );

  return content.replace(/((?:from\s+|import\()(['"]))(\.{1,2}\/[^'"]+)\2/g, (match, prefix: string, _quote: string, specifier: string) => {
    const sourcePath = stripExtension(normalize(join(sourceDirectory, specifier))).replaceAll('\\', '/');
    const destination = sourceToDestination.get(sourcePath);
    if (!destination) return match.replace(/\.js(['"]?)$/, '$1');
    let next = relative(destinationDirectory, stripExtension(destination)).replaceAll('\\', '/');
    if (!next.startsWith('.')) next = `./${next}`;
    return `${prefix}${next}${prefix.at(-1)}`;
  });
}

function stripExtension(path: string) {
  return path.replace(/\.(?:js|ts|tsx)$/, '');
}

async function readProjectPackage(cwd: string) {
  try {
    JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new Error(`No package.json found in ${cwd}.`);
    throw new Error(`Could not read package.json in ${cwd}.`, { cause: error });
  }
}

async function pathExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EISDIR') return true;
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    return true;
  }
}

function packageRoot() {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..');
}

function printHelp() {
  console.log(`react-native-pdf-reusables

Copy source-owned PDF components into a React Native project.

Usage:
  react-native-pdf-reusables add <component...> [options]

Options:
  --cwd <path>       Project directory (default: current directory)
  --path <path>      Output directory (default: src/components/pdf or components/pdf)
  --overwrite        Replace changed files that already exist
  -h, --help         Show help
  -v, --version      Show version

Components:
  ${publicEntries.join(', ')}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
