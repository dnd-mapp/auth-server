import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserModule } from '../user.module';
import { UserRoleService } from './user-role.service';

describe('UserRoleService', () => {
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
            service: module.get(UserRoleService),
        };
    }

    it('should create', async () => {
        const { service } = await setupTest();
        expect(service).toBeDefined();
    });
});
