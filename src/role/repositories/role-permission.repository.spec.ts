import { seedPermission } from '@/permission/test';
import { InternalServerErrorException } from '@nestjs/common';
import { RolePermissionDto } from '../dtos';
import { seedRole, setupRoleTest } from '../test';

describe('RolePermissionRepository', () => {
    describe('findPermissionForRole', () => {
        it('should return a RolePermissionDto for the pre-seeded assignment', async () => {
            const { rolePermissionRepository } = await setupRoleTest();
            expect(await rolePermissionRepository.findPermissionForRole(seedRole.id, seedPermission.id)).toBeInstanceOf(
                RolePermissionDto
            );
        });

        it('should return null when not assigned', async () => {
            const { rolePermissionRepository, permissionDb } = await setupRoleTest();
            const otherPermission = permissionDb.add('permission:write');
            expect(await rolePermissionRepository.findPermissionForRole(seedRole.id, otherPermission.id)).toBeNull();
        });

        it('should throw an InternalServerErrorException on database error', async () => {
            const { rolePermissionRepository, databaseService } = await setupRoleTest();
            vi.spyOn(databaseService.prisma.rolePermission, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                rolePermissionRepository.findPermissionForRole(seedRole.id, seedPermission.id)
            ).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });

    describe('findAllPermissionsForRole', () => {
        it('should return 1 permission initially (pre-seeded)', async () => {
            const { rolePermissionRepository } = await setupRoleTest();
            expect(await rolePermissionRepository.findAllPermissionsForRole(seedRole.id)).toHaveLength(1);
        });

        it('should return permissions after assignment', async () => {
            const { rolePermissionRepository, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            await rolePermissionRepository.assignPermissionToRole(seedRole.id, newPermission.id);
            const permissions = await rolePermissionRepository.findAllPermissionsForRole(seedRole.id);
            expect(permissions).toHaveLength(2);
            expect(permissions[0]).toBeInstanceOf(RolePermissionDto);
        });

        it('should throw an InternalServerErrorException on database error', async () => {
            const { rolePermissionRepository, databaseService } = await setupRoleTest();
            vi.spyOn(databaseService.prisma.rolePermission, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(rolePermissionRepository.findAllPermissionsForRole(seedRole.id)).rejects.toBeInstanceOf(
                InternalServerErrorException
            );
        });
    });

    describe('assignPermissionToRole', () => {
        it('should return a RolePermissionDto', async () => {
            const { rolePermissionRepository, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            const result = await rolePermissionRepository.assignPermissionToRole(seedRole.id, newPermission.id);
            expect(result).toBeInstanceOf(RolePermissionDto);
            expect(result.roleId).toBe(seedRole.id);
            expect(result.permissionId).toBe(newPermission.id);
        });

        it('should throw an InternalServerErrorException on database error', async () => {
            const { rolePermissionRepository, databaseService, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            vi.spyOn(databaseService.prisma.rolePermission, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                rolePermissionRepository.assignPermissionToRole(seedRole.id, newPermission.id)
            ).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });

    describe('assignPermissionsToRole', () => {
        it('should return an array of RolePermissionDtos for newly assigned permissions', async () => {
            const { rolePermissionRepository, permissionDb } = await setupRoleTest();
            const perm1 = permissionDb.add('permission:write');
            const perm2 = permissionDb.add('permission:delete');
            const result = await rolePermissionRepository.assignPermissionsToRole(seedRole.id, [perm1.id, perm2.id]);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(RolePermissionDto);
            expect(result[1]).toBeInstanceOf(RolePermissionDto);
        });

        it('should skip duplicates and still succeed', async () => {
            const { rolePermissionRepository, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            const result = await rolePermissionRepository.assignPermissionsToRole(seedRole.id, [
                seedPermission.id,
                newPermission.id,
            ]);
            expect(result).toHaveLength(2);
        });

        it('should throw an InternalServerErrorException on createMany database error', async () => {
            const { rolePermissionRepository, databaseService, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            vi.spyOn(databaseService.prisma.rolePermission, 'createMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                rolePermissionRepository.assignPermissionsToRole(seedRole.id, [newPermission.id])
            ).rejects.toBeInstanceOf(InternalServerErrorException);
        });

        it('should throw an InternalServerErrorException on findMany database error after createMany', async () => {
            const { rolePermissionRepository, databaseService, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            vi.spyOn(databaseService.prisma.rolePermission, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                rolePermissionRepository.assignPermissionsToRole(seedRole.id, [newPermission.id])
            ).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });

    describe('removePermissionFromRole', () => {
        it('should resolve for an existing assignment', async () => {
            const { rolePermissionRepository } = await setupRoleTest();
            await expect(
                rolePermissionRepository.removePermissionFromRole(seedRole.id, seedPermission.id)
            ).resolves.toBeUndefined();
        });

        it('should throw an InternalServerErrorException on database error', async () => {
            const { rolePermissionRepository, databaseService } = await setupRoleTest();
            vi.spyOn(databaseService.prisma.rolePermission, 'delete').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                rolePermissionRepository.removePermissionFromRole(seedRole.id, seedPermission.id)
            ).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });

    describe('removePermissionsFromRole', () => {
        it('should resolve for existing assignments', async () => {
            const { rolePermissionRepository } = await setupRoleTest();
            await expect(
                rolePermissionRepository.removePermissionsFromRole(seedRole.id, [seedPermission.id])
            ).resolves.toBeUndefined();
        });

        it('should throw an InternalServerErrorException on database error', async () => {
            const { rolePermissionRepository, databaseService } = await setupRoleTest();
            vi.spyOn(databaseService.prisma.rolePermission, 'deleteMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                rolePermissionRepository.removePermissionsFromRole(seedRole.id, [seedPermission.id])
            ).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });
});
