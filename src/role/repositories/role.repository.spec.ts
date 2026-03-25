import { Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RoleDto } from '../dtos';
import { seedRole, setupRoleTest } from '../test';

describe('RoleRepository', () => {
    describe('findAll', () => {
        it('should return all roles', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            expect(await repository.findAll()).toHaveLength(1);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupRoleTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.role, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findAll()).rejects.toThrow();
        });
    });

    describe('findById', () => {
        it('should return a RoleDto', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            expect(await repository.findById(seedRole.id)).toBeInstanceOf(RoleDto);
        });

        it('should return null for an unknown ID', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            expect(await repository.findById(nanoid())).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupRoleTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.role, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findById(seedRole.id)).rejects.toThrow();
        });
    });

    describe('findByName', () => {
        it('should return a RoleDto', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            expect(await repository.findByName(seedRole.name)).toBeInstanceOf(RoleDto);
        });

        it('should return null for an unknown name', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            expect(await repository.findByName('unknown-role')).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupRoleTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.role, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findByName(seedRole.name)).rejects.toThrow();
        });
    });

    describe('create', () => {
        it('should return the created RoleDto', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            const result = await repository.create({ name: 'moderator' });
            expect(result).toBeInstanceOf(RoleDto);
            expect(result.name).toBe('moderator');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupRoleTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.role, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.create({ name: 'moderator' })).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should return the updated RoleDto', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            const result = await repository.update(seedRole.id, { name: 'superadmin' });
            expect(result).toBeInstanceOf(RoleDto);
            expect(result.name).toBe('superadmin');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupRoleTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.role, 'update').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.update(seedRole.id, { name: 'superadmin' })).rejects.toThrow();
        });
    });

    describe('deleteById', () => {
        it('should resolve', async () => {
            const { repository } = await setupRoleTest();
            Logger.overrideLogger(false);
            await expect(repository.deleteById(seedRole.id)).resolves.toBeUndefined();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupRoleTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.role, 'delete').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.deleteById(seedRole.id)).rejects.toThrow();
        });
    });
});
