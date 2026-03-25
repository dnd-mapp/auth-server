import { ConflictException, NotFoundException } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';
import { PermissionDto } from './dtos';
import { seedPermission, setupPermissionTest } from './test';

const mockResponse = { headers: vi.fn() } as unknown as FastifyReply;

describe('PermissionController', () => {
    describe('getAll', () => {
        it('should return all permissions', async () => {
            const { controller } = await setupPermissionTest();
            expect(await controller.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a PermissionDto', async () => {
            const { controller } = await setupPermissionTest();
            expect(await controller.getById(seedPermission.id)).toBeInstanceOf(PermissionDto);
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupPermissionTest();
            await expect(controller.getById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('create', () => {
        it('should return the created PermissionDto', async () => {
            const { controller } = await setupPermissionTest();
            const result = await controller.create({ name: 'permission:write' }, mockResponse);
            expect(result).toBeInstanceOf(PermissionDto);
            expect(result.name).toBe('permission:write');
        });
    });

    describe('updateById', () => {
        it('should return the updated PermissionDto', async () => {
            const { controller } = await setupPermissionTest();
            const result = await controller.updateById(seedPermission.id, { name: 'permission:updated' });
            expect(result).toBeInstanceOf(PermissionDto);
            expect(result.name).toBe('permission:updated');
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupPermissionTest();
            await expect(controller.updateById(nanoid(), { name: 'permission:updated' })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException', async () => {
            const { controller, permissionDb } = await setupPermissionTest();
            permissionDb.add('permission:other');
            await expect(controller.updateById(seedPermission.id, { name: 'permission:other' })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { controller } = await setupPermissionTest();
            await expect(controller.removeById(seedPermission.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupPermissionTest();
            await expect(controller.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
