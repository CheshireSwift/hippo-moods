module.exports = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer', 'jest-emotion'],
  testEnvironment: 'jsdom',
};
