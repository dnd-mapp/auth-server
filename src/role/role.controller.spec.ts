import { ConflictException, NotFoundException } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';
import { RoleDto } from './dtos';
import { seedRole, setupRoleTest } from './test';

const mockResponse = { headers: vi.fn() } as unknown as FastifyReply;

describe('RoleController', () => {
    describe('getAll', () => {
        it('should return all roles', async () => {
            const { controller } = await setupRoleTest();
            expect(await controller.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a RoleDto', async () => {
            const { controller } = await setupRoleTest();
            expect(await controller.getById(seedRole.id)).toBeInstanceOf(RoleDto);
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.getById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('create', () => {
        it('should return the created RoleDto', async () => {
            const { controller } = await setupRoleTest();
            const result = await controller.create({ name: 'moderator' }, mockResponse);
            expect(result).toBeInstanceOf(RoleDto);
            expect(result.name).toBe('moderator');
        });
    });

    describe('updateById', () => {
        it('should return the updated RoleDto', async () => {
            const { controller } = await setupRoleTest();
            const result = await controller.updateById(seedRole.id, { name: 'superadmin' });
            expect(result).toBeInstanceOf(RoleDto);
            expect(result.name).toBe('superadmin');
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.updateById(nanoid(), { name: 'superadmin' })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException', async () => {
            const { controller } = await setupRoleTest();
            await controller.create({ name: 'other-role' }, mockResponse);
            await expect(controller.updateById(seedRole.id, { name: 'other-role' })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.removeById(seedRole.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
