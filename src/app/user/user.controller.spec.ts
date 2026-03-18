import { MockPrisma } from '@/test';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { UserController } from './user.controller';
import { UserModule } from './user.module';

describe('UserController', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), UserModule],
        }).compile();

        return {
            controller: module.get(UserController),
        };
    }

    it('should be defined', async () => {
        const { controller } = await setupTest();
        expect(controller).toBeDefined();
    });
});
