import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PermissionModule } from './permission.module';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), PermissionModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        await module.init();

        return {
            service: module.get(PermissionService),
        };
    }

    it('should create', async () => {
        const { service } = await setupTest();
        expect(service).toBeDefined();
    });
});
