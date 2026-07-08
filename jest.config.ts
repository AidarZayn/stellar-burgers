import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/tests/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest
      }
    ]
  },
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts'
  }
};

export default config;
