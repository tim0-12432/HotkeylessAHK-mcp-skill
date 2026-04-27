import { defineConfig, type Plugin } from 'vite';
import { chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

function shebangPlugin(file: string): Plugin {
  return {
    name: 'shebang',
    closeBundle() {
      const path = resolve(file);
      const content = readFileSync(path, 'utf8');
      if (!content.startsWith('#!')) {
        writeFileSync(path, `#!/usr/bin/env node\n${content}`);
      }
      // Make it executable (matters on Linux/macOS)
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
            // Don't bundle node built-ins or your SDK dependency into the file
            external: ['@modelcontextprotocol/sdk', /^node:/] 
        }
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
            rollupTypes: true
        }),
        shebangPlugin('dist/index.js')
    ]
})
