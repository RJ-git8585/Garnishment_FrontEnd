import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom', // Use jsdom for DOM simulation
        setupFiles: './src/setupTests.js', // Optional setup file
    },
});
