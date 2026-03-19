import { MockConfigService, MockPrisma } from '@/test';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { DatabaseModule, DatabaseService } from '../database';
import { UserDto } from './dtos';
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

    describe('findById', () => {
        it('should return a user by ID', async () => {
            const { repository } = await setupTest();
            expect(await repository.findById('mb9NzZCnMCCrWoETc2_DT')).toBeInstanceOf(UserDto);
        });

        it('should return null', async () => {
            const { repository } = await setupTest();
            expect(await repository.findById(nanoid())).toEqual(null);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupTest();

            vi.spyOn(databaseService.prisma.user, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findById('mb9NzZCnMCCrWoETc2_DT')).rejects.toThrow();
        });
    });
});
