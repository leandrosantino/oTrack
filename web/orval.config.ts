import { defineConfig } from 'orval';
 
export default defineConfig({
  base: {
    input: {
      target: 'http://127.0.0.1:3000/docs/json'
    },
    output: {
      target: 'src/api.ts',
      client: 'axios',
      baseUrl: 'http://localhost:3000'
    }
  },
});