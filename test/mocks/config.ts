import { AppConfig } from '@/common';

export const defaultMockConfig: AppConfig = {
    server: {
        host: 'localhost',
        port: 4350,
        cors: {
            origins: ['http://localhost:4200'],
        },
        ssl: {},
    },
    database: {
        host: 'localhost',
        port: 3306,
        schema: 'dma_auth',
        user: 'dma',
        password: 'password',
    },
    security: {
        passwordPepper: 'test-pepper',
        issuer: 'https://localhost.auth.dndmapp.dev:4350',
        keyEncryptionSecret: 'test-key-encryption-secret-32chars!!',
    },
};

export class MockConfigService {
    public config: AppConfig;

    constructor(config?: Partial<AppConfig>) {
        this.config = {
            server: {
                ...defaultMockConfig.server,
                ...config?.server,
            },
            database: {
                ...defaultMockConfig.database,
                ...config?.database,
            },
            security: {
                ...defaultMockConfig.security,
                ...config?.security,
            },
        };
    }

    public get(key: keyof AppConfig) {
        return this.config[key];
    }
}
