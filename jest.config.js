export default {
    // Use Babel to transpile files
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transform .js, .jsx, .ts and .tsx files using babel-jest
    },
    // Specify file extensions Jest should process
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    // Specify directories Jest should search for tests
    testMatch: [
        '**/tests/**/*.(test|spec).(js|jsx|ts|tsx)',
    ],
    // Setup test environment
    testEnvironment: 'jsdom',
    // Module name mapper for handling CSS and other assets
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__mocks__/fileMock.js',
    },
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
};