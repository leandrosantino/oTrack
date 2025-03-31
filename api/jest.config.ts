import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup.ts'],
  modulePaths: ['<rootDir>/src'], // Suporte ao baseUrl
  rootDir: '.',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], // Formatos do relatório de cobertura
  collectCoverageFrom: [
    'src/services/**/*.{js,ts}', // Arquivos que devem ser incluídos na análise
    '!src/*.{js,ts}',
    '!src/**/*.d.ts', // Exclui arquivos de declaração de tipos
    '!src/**/index.ts', // Exemplo: exclui arquivos de índice
    '!src/**/*.spec.ts', // Exclui arquivos de teste
  ],
};

export default config;
