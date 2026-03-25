import { Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PermissionDto } from './dtos';
import { seedPermission, setupPermissionTest } from './test';

describe('PermissionRepository', () => {
    describe('findAll', () => {
        it('should return all permissions', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            expect(await repository.findAll()).toHaveLength(1);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupPermissionTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.permission, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findAll()).rejects.toThrow();
        });
    });

    describe('findById', () => {
        it('should return a PermissionDto', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            expect(await repository.findById(seedPermission.id)).toBeInstanceOf(PermissionDto);
        });

        it('should return null for an unknown ID', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            expect(await repository.findById(nanoid())).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupPermissionTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.permission, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findById(seedPermission.id)).rejects.toThrow();
        });
    });

    describe('findByName', () => {
        it('should return a PermissionDto', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            expect(await repository.findByName(seedPermission.name)).toBeInstanceOf(PermissionDto);
        });

        it('should return null for an unknown name', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            expect(await repository.findByName('unknown:permission')).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupPermissionTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.permission, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findByName(seedPermission.name)).rejects.toThrow();
        });
    });

    describe('create', () => {
        it('should return the created PermissionDto', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            const result = await repository.create({ name: 'permission:write' });
            expect(result).toBeInstanceOf(PermissionDto);
            expect(result.name).toBe('permission:write');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupPermissionTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.permission, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.create({ name: 'permission:write' })).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should return the updated PermissionDto', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            const result = await repository.update(seedPermission.id, { name: 'permission:updated' });
            expect(result).toBeInstanceOf(PermissionDto);
            expect(result.name).toBe('permission:updated');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupPermissionTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.permission, 'update').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.update(seedPermission.id, { name: 'permission:updated' })).rejects.toThrow();
        });
    });

    describe('deleteById', () => {
        it('should resolve', async () => {
            const { repository } = await setupPermissionTest();
            Logger.overrideLogger(false);
            await expect(repository.deleteById(seedPermission.id)).resolves.toBeUndefined();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupPermissionTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.permission, 'delete').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.deleteById(seedPermission.id)).rejects.toThrow();
        });
    });
});
