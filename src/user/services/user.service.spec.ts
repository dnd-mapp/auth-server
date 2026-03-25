import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { theLegend27 } from '@/user/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserDto } from '../dtos';
import { UserModule } from '../user.module';
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
        expect(await service.getAll()).toHaveLength(1);
    });

    it('should return a user by ID', async () => {
        const { service } = await setupTest();
        expect(await service.getById(theLegend27.id)).toBeInstanceOf(UserDto);
    });
});
