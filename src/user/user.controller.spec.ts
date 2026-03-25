import { seedRole } from '@/role/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';
import { UserDto, UserRoleDto } from './dtos';
import { setupUserTest, theLegend27 } from './test';

const mockResponse = { headers: vi.fn() } as unknown as FastifyReply;

describe('UserController', () => {
    describe('getAll', () => {
        it('should return all users', async () => {
            const { controller } = await setupUserTest();
            expect(await controller.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a user by ID', async () => {
            const { controller } = await setupUserTest();
            expect(await controller.getById(theLegend27.id)).toBeInstanceOf(UserDto);
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.getById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('create', () => {
        it('should return the created UserDto', async () => {
            const { controller } = await setupUserTest();
            const result = await controller.create({ username: 'NewUser', roleIds: [seedRole.id] }, mockResponse);
            expect(result).toBeInstanceOf(UserDto);
        });

        it('should throw a ConflictException when username is taken', async () => {
            const { controller } = await setupUserTest();
            await expect(
                controller.create({ username: theLegend27.username, roleIds: [seedRole.id] }, mockResponse)
            ).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('updateById', () => {
        it('should return the updated UserDto', async () => {
            const { controller } = await setupUserTest();
            const result = await controller.updateById(theLegend27.id, { username: 'UpdatedLegend' });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('UpdatedLegend');
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.updateById(nanoid(), { username: 'UpdatedLegend' })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when username is taken', async () => {
            const { controller, userDb } = await setupUserTest();
            userDb.add('AnotherUser');
            await expect(controller.updateById(theLegend27.id, { username: 'AnotherUser' })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.removeById(theLegend27.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('purgeById', () => {
        it('should resolve', async () => {
            const { controller } = await setupUserTest();
            await controller.removeById(theLegend27.id);
            await expect(controller.purgeById(theLegend27.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.purgeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('getRolesForUser', () => {
        it('should return 1 role initially (pre-seeded)', async () => {
            const { controller } = await setupUserTest();
            expect(await controller.getRolesForUser(theLegend27.id)).toHaveLength(1);
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.getRolesForUser(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('assignRoleToUser', () => {
        it('should return a UserRoleDto', async () => {
            const { controller, roleDb } = await setupUserTest();
            const newRole = roleDb.add('editor');
            const result = await controller.assignRoleToUser(theLegend27.id, newRole.id);
            expect(result).toBeInstanceOf(UserRoleDto);
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.assignRoleToUser(nanoid(), seedRole.id)).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.assignRoleToUser(theLegend27.id, nanoid())).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when role already assigned', async () => {
            const { controller } = await setupUserTest();
            await expect(controller.assignRoleToUser(theLegend27.id, seedRole.id)).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });
});
