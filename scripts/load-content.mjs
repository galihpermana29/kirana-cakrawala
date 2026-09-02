// Loads the six typed content modules in src/content/ into a plain Node
// process. They are TypeScript, and they import each other without file
// extensions, so Node cannot read them directly - esbuild bundles them into
// one ESM file first, which is then imported.
//
// esbuild is already what Astro's dev server and build use, so the modules are
// evaluated the same way here as they are when the site is built.

import { build } from 'esbuild';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/* Module file name -> the namespace it is exposed under. */
const MODULES = {
  home: 'home',
  'what-we-do': 'whatWeDo',
  news: 'news',
  partners: 'partners',
  contact: 'contact',
  about: 'about',
};

/**
 * @param {string} root The repository root.
 * @returns {Promise<Record<string, Record<string, unknown>>>} One namespace per
 *   content module, keyed as in MODULES.
 */
export async function loadContentModules(root) {
  const entry = Object.entries(MODULES)
    .map(([file, ns]) => `export * as ${ns} from './src/content/${file}';`)
    .join('\n');

  const result = await build({
    stdin: { contents: entry, resolveDir: root, loader: 'ts', sourcefile: 'content.ts' },
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
    logLevel: 'silent',
  });

  const [output] = result.outputFiles;
  if (!output) throw new Error('esbuild produced no output for the content modules');

  const dir = await mkdtemp(join(tmpdir(), 'kca-content-'));
  const file = join(dir, 'content.mjs');
  try {
    await writeFile(file, output.text, 'utf8');
    return await import(pathToFileURL(file).href);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
