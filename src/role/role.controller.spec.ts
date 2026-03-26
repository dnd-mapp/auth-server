import { seedPermission } from '@/permission/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';
import { RoleDto, RolePermissionDto } from './dtos';
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
            const { controller, roleDb } = await setupRoleTest();
            roleDb.add('other-role');
            await expect(controller.updateById(seedRole.id, { name: 'other-role' })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { controller, roleDb } = await setupRoleTest();
            const newRole = roleDb.add('some-role');
            await expect(controller.removeById(newRole.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('assignPermissionToRole', () => {
        it('should return a RolePermissionDto', async () => {
            const { controller, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            const result = await controller.assignPermissionToRole(seedRole.id, newPermission.id);
            expect(result).toBeInstanceOf(RolePermissionDto);
            expect(result.roleId).toBe(seedRole.id);
            expect(result.permissionId).toBe(newPermission.id);
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.assignPermissionToRole(nanoid(), seedPermission.id)).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a NotFoundException when permission not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.assignPermissionToRole(seedRole.id, nanoid())).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when permission already assigned', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.assignPermissionToRole(seedRole.id, seedPermission.id)).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('assignPermissionsToRole', () => {
        it('should return an array of RolePermissionDtos', async () => {
            const { controller, permissionDb } = await setupRoleTest();
            const perm1 = permissionDb.add('permission:write');
            const perm2 = permissionDb.add('permission:delete');
            const result = await controller.assignPermissionsToRole(seedRole.id, {
                permissionIds: [perm1.id, perm2.id],
            });
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(RolePermissionDto);
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { controller, permissionDb } = await setupRoleTest();
            const newPermission = permissionDb.add('permission:write');
            await expect(
                controller.assignPermissionsToRole(nanoid(), { permissionIds: [newPermission.id] })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when a permission is not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(
                controller.assignPermissionsToRole(seedRole.id, { permissionIds: [nanoid()] })
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('removePermissionFromRole', () => {
        it('should resolve for an existing assignment', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.removePermissionFromRole(seedRole.id, seedPermission.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.removePermissionFromRole(nanoid(), seedPermission.id)).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a NotFoundException when permission not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(controller.removePermissionFromRole(seedRole.id, nanoid())).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a NotFoundException when permission is not assigned', async () => {
            const { controller, permissionDb } = await setupRoleTest();
            const unassignedPermission = permissionDb.add('permission:write');
            await expect(
                controller.removePermissionFromRole(seedRole.id, unassignedPermission.id)
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('removePermissionsFromRole', () => {
        it('should resolve for existing assignments', async () => {
            const { controller } = await setupRoleTest();
            await expect(
                controller.removePermissionsFromRole(seedRole.id, { permissionIds: [seedPermission.id] })
            ).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(
                controller.removePermissionsFromRole(nanoid(), { permissionIds: [seedPermission.id] })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when a permission is not found', async () => {
            const { controller } = await setupRoleTest();
            await expect(
                controller.removePermissionsFromRole(seedRole.id, { permissionIds: [nanoid()] })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a NotFoundException when a permission is not assigned', async () => {
            const { controller, permissionDb } = await setupRoleTest();
            const unassignedPermission = permissionDb.add('permission:write');
            await expect(
                controller.removePermissionsFromRole(seedRole.id, { permissionIds: [unassignedPermission.id] })
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
