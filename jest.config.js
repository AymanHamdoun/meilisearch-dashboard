export default {
    // Use Babel to transpile files
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Transform .js and .jsx files using babel-jest
    },
    // Specify file extensions Jest should process
    moduleFileExtensions: ['js', 'jsx'],
    // Specify directories Jest should search for tests
    testMatch: [
        '**/tests/**/*.(test|spec).js',
    ],
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
};