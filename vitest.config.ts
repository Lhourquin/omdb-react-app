import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        '**/*.type.ts',
        '**/types/**',
        '**/*.config.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/__tests__/**',
        '**/components/**', 
        '**/hooks/movie/**', 
        '**/hooks/localStorage/**',
        '**/main.tsx',
        '**/App.tsx',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
})

