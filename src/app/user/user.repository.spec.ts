import { MockConfigService, MockPrisma } from '@/test';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule, DatabaseService } from '../database';
import { UserModule } from './user.module';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
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
            repository: module.get(UserRepository),
            databaseService: module.get(DatabaseService<MockPrisma>),
        };
    }

    describe('findAll', () => {
        it('should return all users', async () => {
            const { repository } = await setupTest();
            expect(await repository.findAll()).toHaveLength(1);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupTest();

            vi.spyOn(databaseService.prisma.user, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findAll()).rejects.toThrow();
        });
    });
});
