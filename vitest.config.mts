import { defineConfig } from 'vitest/config';

const isCI = Boolean(process.env['CI']);

export default defineConfig({
    root: __dirname,
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        clearMocks: true,
        coverage: {
            enabled: true,
            exclude: ['*.module.ts', 'main.ts'],
            include: ['src/**/*.ts'],
            provider: 'v8',
            reportOnFailure: true,
            reporter: ['text-summary', 'html'],
            reportsDirectory: 'coverage',
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
        environment: 'node',
        globals: true,
        include: ['src/**/*.spec.ts'],
        name: 'auth-server',
        open: false,
        passWithNoTests: true,
        reporters: [
            'dot',
            ['html', { outputFile: 'reports/auth-server/index.html' }],
            ...(isCI ? ['github-actions'] : []),
        ],
        sequence: {
            shuffle: true,
        },
        uiBase: '/auth-server/',
    },
});
