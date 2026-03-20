import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { RoleModule } from './role.module';
import { RoleService } from './role.service';

describe('RoleService', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), RoleModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        await module.init();

        return {
            service: module.get(RoleService),
        };
    }

    it('should create', async () => {
        const { service } = await setupTest();
        expect(service).toBeDefined();
    });
});
