const { pathsToModuleNameMapper } = require('ts-jest');
const { name } = require('./package.json');

const paths = {
  '@application/*': ['application/*'],
  '@domain/*': ['domain/*'],
  '@presentation/*': ['presentation/*'],
  '@shared/*': ['shared/*'],
};

const moduleNameMapper = pathsToModuleNameMapper(paths, { prefix: '<rootDir>/src' });

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  displayName: name,
  clearMocks: true,
  coverageProvider: 'v8',
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.setup.ts',
    '<rootDir>/configs/',
    '<rootDir>/dist/',
    'jest.config.ts',
    '.json',
    '.snap',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper,
};

process.env = Object.assign(process.env, {
  ANY_ENV_KEY: 'any_value',
});
