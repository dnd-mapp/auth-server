import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RoleDto } from '../dtos';
import { seedRole, setupRoleTest } from '../test';

describe('RoleService', () => {
    describe('getAll', () => {
        it('should return all roles', async () => {
            const { service } = await setupRoleTest();
            expect(await service.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a RoleDto', async () => {
            const { service } = await setupRoleTest();
            expect(await service.getById(seedRole.id)).toBeInstanceOf(RoleDto);
        });

        it('should return null for unknown ID', async () => {
            const { service } = await setupRoleTest();
            expect(await service.getById(nanoid())).toBeNull();
        });
    });

    describe('create', () => {
        it('should return the created RoleDto', async () => {
            const { service } = await setupRoleTest();
            const result = await service.create({ name: 'moderator' });
            expect(result).toBeInstanceOf(RoleDto);
            expect(result.name).toBe('moderator');
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service } = await setupRoleTest();
            await expect(service.create({ name: seedRole.name })).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('update', () => {
        it('should return the updated RoleDto', async () => {
            const { service } = await setupRoleTest();
            const result = await service.update(seedRole.id, { name: 'superadmin' });
            expect(result).toBeInstanceOf(RoleDto);
            expect(result.name).toBe('superadmin');
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupRoleTest();
            await expect(service.update(nanoid(), { name: 'superadmin' })).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service, roleDb } = await setupRoleTest();
            roleDb.add('other-role');
            await expect(service.update(seedRole.id, { name: 'other-role' })).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { service, roleDb } = await setupRoleTest();
            const newRole = roleDb.add('some-role');
            await expect(service.removeById(newRole.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupRoleTest();
            await expect(service.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a ConflictException when role is assigned to users', async () => {
            const { service } = await setupRoleTest();
            await expect(service.removeById(seedRole.id)).rejects.toBeInstanceOf(ConflictException);
        });
    });
});
