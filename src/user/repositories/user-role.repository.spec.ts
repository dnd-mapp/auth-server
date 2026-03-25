import { DatabaseModule, DatabaseService } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserModule } from '../user.module';
import { UserRoleRepository } from './user-role.repository';

describe('UserRoleRepository', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), UserModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        Logger.overrideLogger(false);

        await module.init();

        return {
            repository: module.get(UserRoleRepository),
            databaseService: module.get(DatabaseService<MockPrisma>),
        };
    }

    it('should create', async () => {
        const { repository } = await setupTest();
        expect(repository).toBeDefined();
    });
});
