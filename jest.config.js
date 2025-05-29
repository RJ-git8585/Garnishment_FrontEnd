export default {
  testEnvironment: "jsdom", // Use jsdom for browser-like environment
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JavaScript/JSX files
    "^.+\\.(css|scss|sass|less)$": "jest-transform-stub", // Mock stylesheets
    "^.+\\.(svg|png|jpg|jpeg|gif|webp|avif)$": "jest-transform-stub" // Mock static assets like SVGs
  },
  moduleNameMapper: {
    "\\.(css|scss|sass|less)$": "identity-obj-proxy", // for CSS Modules
    "^.+\\.module\\.(css|scss|sass|less)$": "identity-obj-proxy", // CSS modules
    "^.+\\.(css|scss|sass|less)$": "<rootDir>/__mocks__/styleMock.js", // regular styles
  },
};
