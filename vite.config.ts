import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react(), visualizer({ filename: 'bundle-size.html', gzipSize: true })],
        server: {
            port: parseInt(env.VITE_PORT) || 5678,
            strictPort: true,
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './test/setup.ts',
            // you might want to disable it, if you don't have tests that rely on CSS
            // since parsing CSS is slow
            css: true,
            reporters: ['default', 'junit'],
            outputFile: 'junit.xml',
            coverage: {
                src: ['./src'],
                all: true,
                include: ['**/*.ts', '**/*.tsx'],
                provider: 'c8',
                reporter: ['text', 'html', 'cobertura'],
            },
        },
    };
});
