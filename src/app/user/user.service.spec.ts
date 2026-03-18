import { MockPrisma } from '@/test';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), UserModule],
        }).compile();

        return {
            service: module.get(UserService),
        };
    }

    it('should be defined', async () => {
        const { service } = await setupTest();
        expect(service).toBeDefined();
    });
});
