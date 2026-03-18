import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
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
            service: module.get(UserService),
        };
    }

    it('should return all users', async () => {
        const { service } = await setupTest();
        expect(await service.getAll()).toEqual([]);
    });
});
