import { defineConfig } from 'orval';

export default defineConfig({
  abantu: {
    output: {
      client: 'zod',
      mode: 'single',
      target: './src/server/zod.ts',
    },
    input: {
      target: 'http://localhost:3000/openapi.json',
    },
  },
});