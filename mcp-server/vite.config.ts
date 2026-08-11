import { defineConfig, type Plugin } from 'vite';
import { chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

function shebangPlugin(file: string): Plugin {
  return {
    name: 'shebang',
    closeBundle() {
      const path = resolve(file);
      const content = readFileSync(path, 'utf8');
      if (!content.startsWith('#!')) {
        writeFileSync(path, `#!/usr/bin/env node\n${content}`);
      }
      chmodSync(path, 0o755);
    },
  };
}

export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['@modelcontextprotocol/sdk', /^node:/]
    }
  },
  plugins: [
    tsconfigPaths(),
    dts({
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      bundleTypes: true
    }),
    shebangPlugin('dist/index.js')
  ]
});
