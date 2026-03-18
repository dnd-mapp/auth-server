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
        };
    }

    public get(key: keyof AppConfig) {
        return this.config[key];
    }
}
