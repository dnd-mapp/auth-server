import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { UserController } from './user.controller';
import { UserModule } from './user.module';

describe('UserController', () => {
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
            controller: module.get(UserController),
        };
    }

    it('should return all users', async () => {
        const { controller } = await setupTest();
        expect(await controller.getAll()).toEqual([]);
    });
});
