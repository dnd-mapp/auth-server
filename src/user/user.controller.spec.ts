import { theLegend27 } from '@/user/test';
import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { UserDto } from './dtos';
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

        module.useLogger(false);

        await module.init();

        return {
            controller: module.get(UserController),
        };
    }

    describe('getAll', () => {
        it('should return all users', async () => {
            const { controller } = await setupTest();
            expect(await controller.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a user by ID', async () => {
            const { controller } = await setupTest();
            expect(await controller.getById(theLegend27.id)).toBeInstanceOf(UserDto);
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupTest();
            await expect(controller.getById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
