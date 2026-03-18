import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
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

        await module.init();

        return {
            repository: module.get(UserRepository),
        };
    }

    describe('findAll', () => {
        it('should return all users', async () => {
            const { repository } = await setupTest();
            expect(await repository.findAll()).toHaveLength(1);
        });
    });
});
