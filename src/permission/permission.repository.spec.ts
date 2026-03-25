import { MockConfigService, MockPrisma } from '@/test';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule, DatabaseService } from '@/database';
import { PermissionModule } from './permission.module';
import { PermissionRepository } from './permission.repository';

describe('PermissionRepository', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), PermissionModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        Logger.overrideLogger(false);

        await module.init();

        return {
            repository: module.get(PermissionRepository),
            databaseService: module.get(DatabaseService<MockPrisma>),
        };
    }

    it('should create', async () => {
        const { repository } = await setupTest();
        expect(repository).toBeDefined();
    });
});
