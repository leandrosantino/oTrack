import { defineConfig } from 'orval';
 
export default defineConfig({
  base: {
    input: {
      target: 'http://127.0.0.1:3000/docs/json'
    },
    output: {
      target: 'src/query.ts',
      client: 'react-query',
      baseUrl: 'http://localhost:3000'
    }
  },
});