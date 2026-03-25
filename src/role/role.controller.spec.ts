import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '@/database';
import { RoleController } from './role.controller';
import { RoleModule } from './role.module';

describe('RoleController', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), RoleModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        module.useLogger(false);

        await module.init();

        return {
            controller: module.get(RoleController),
        };
    }

    it('should create', async () => {
        const { controller } = await setupTest();
        expect(controller).toBeDefined();
    });
});
