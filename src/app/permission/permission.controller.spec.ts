import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { PermissionController } from './permission.controller';
import { PermissionModule } from './permission.module';

describe('PermissionController', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), PermissionModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        module.useLogger(false);

        await module.init();

        return {
            controller: module.get(PermissionController),
        };
    }

    it('should create', async () => {
        const { controller } = await setupTest();
        expect(controller).toBeDefined();
    });
});
