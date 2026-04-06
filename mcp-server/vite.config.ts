import { resolve } from 'path'
import { defineConfig } from 'vite'

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
    }
})
