module.exports = {
  verbose: true,
  testEnvironment: 'node',
  preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/__tests__/**/*.unit.test.[jt]s?(x)', '**/?(*.)+(spec|test).unit.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['./.next/', './node_modules/'],
  roots: ['<rootDir>/server/src'],
};
