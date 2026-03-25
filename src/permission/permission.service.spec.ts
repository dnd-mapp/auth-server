import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PermissionDto } from './dtos';
import { seedPermission, setupPermissionTest } from './test';

describe('PermissionService', () => {
    describe('getAll', () => {
        it('should return all permissions', async () => {
            const { service } = await setupPermissionTest();
            expect(await service.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a PermissionDto', async () => {
            const { service } = await setupPermissionTest();
            expect(await service.getById(seedPermission.id)).toBeInstanceOf(PermissionDto);
        });

        it('should return null for unknown ID', async () => {
            const { service } = await setupPermissionTest();
            expect(await service.getById(nanoid())).toBeNull();
        });
    });

    describe('create', () => {
        it('should return the created PermissionDto', async () => {
            const { service } = await setupPermissionTest();
            const result = await service.create({ name: 'permission:write' });
            expect(result).toBeInstanceOf(PermissionDto);
            expect(result.name).toBe('permission:write');
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service } = await setupPermissionTest();
            await expect(service.create({ name: seedPermission.name })).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('update', () => {
        it('should return the updated PermissionDto', async () => {
            const { service } = await setupPermissionTest();
            const result = await service.update(seedPermission.id, { name: 'permission:updated' });
            expect(result).toBeInstanceOf(PermissionDto);
            expect(result.name).toBe('permission:updated');
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupPermissionTest();
            await expect(service.update(nanoid(), { name: 'permission:updated' })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when new name is taken', async () => {
            const { service } = await setupPermissionTest();
            await service.create({ name: 'permission:other' });
            await expect(service.update(seedPermission.id, { name: 'permission:other' })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { service } = await setupPermissionTest();
            await expect(service.removeById(seedPermission.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupPermissionTest();
            await expect(service.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
