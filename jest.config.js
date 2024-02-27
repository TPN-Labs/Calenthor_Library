module.exports = {
    coveragePathIgnorePatterns: ['<rootDir>/src/errors/', '<rootDir>/src/utils/', '<rootDir>/tests/data/'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)s$',
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
