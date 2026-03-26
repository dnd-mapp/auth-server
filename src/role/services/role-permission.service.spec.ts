import { seedPermission } from '@/permission/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RolePermissionDto } from '../dtos';
import { seedRole, setupRoleTest } from '../test';

describe('RolePermissionService', () => {
    describe('assignPermissionToRole', () => {
        it('should return a RolePermissionDto', async () => {
            const { rolePermissionService, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            const result = await rolePermissionService.assignPermissionToRole(seedRole.id, newPermission.id);
            expect(result).toBeInstanceOf(RolePermissionDto);
            expect(result.roleId).toBe(seedRole.id);
            expect(result.permissionId).toBe(newPermission.id);
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.assignPermissionToRole(nanoid(), seedPermission.id)
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when permission not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(rolePermissionService.assignPermissionToRole(seedRole.id, nanoid())).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when permission already assigned', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.assignPermissionToRole(seedRole.id, seedPermission.id)
            ).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('assignPermissionsToRole', () => {
        it('should return an array of RolePermissionDtos', async () => {
            const { rolePermissionService, permissionDb } = await setupRoleTest();
            const perm1 = permissionDb.add('permission:write');
            const perm2 = permissionDb.add('permission:delete');
            await expect(
                rolePermissionService.assignPermissionsToRole(seedRole.id, [perm1.id, perm2.id])
            ).resolves.toHaveLength(2);
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { rolePermissionService, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            await expect(
                rolePermissionService.assignPermissionsToRole(nanoid(), [newPermission.id])
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when a permission is not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(rolePermissionService.assignPermissionsToRole(seedRole.id, [nanoid()])).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should silently skip already-assigned permissions', async () => {
            const { rolePermissionService, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            await expect(
                rolePermissionService.assignPermissionsToRole(seedRole.id, [seedPermission.id, newPermission.id])
            ).resolves.toHaveLength(2);
        });
    });

    describe('removePermissionFromRole', () => {
        it('should resolve for an existing assignment', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.removePermissionFromRole(seedRole.id, seedPermission.id)
            ).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.removePermissionFromRole(nanoid(), seedPermission.id)
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when permission not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(rolePermissionService.removePermissionFromRole(seedRole.id, nanoid())).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a NotFoundException when permission is not assigned to role', async () => {
            const { rolePermissionService, permissionDb } = await setupRoleTest();
            const unassignedPermission = permissionDb.add('permission:write');
            await expect(
                rolePermissionService.removePermissionFromRole(seedRole.id, unassignedPermission.id)
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('removePermissionsFromRole', () => {
        it('should resolve for existing assignments', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.removePermissionsFromRole(seedRole.id, [seedPermission.id])
            ).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.removePermissionsFromRole(nanoid(), [seedPermission.id])
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when a permission is not found', async () => {
            const { rolePermissionService } = await setupRoleTest();
            await expect(
                rolePermissionService.removePermissionsFromRole(seedRole.id, [nanoid()])
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when a permission is not assigned to role', async () => {
            const { rolePermissionService, permissionDb } = await setupRoleTest();
            const unassignedPermission = permissionDb.add('permission:write');
            await expect(
                rolePermissionService.removePermissionsFromRole(seedRole.id, [unassignedPermission.id])
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
