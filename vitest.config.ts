import { defineConfig } from 'vitest/config';

// Keep tests independent of HTTPS certificates and the production service worker.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 10000,
  },
});
