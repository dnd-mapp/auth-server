import { seedRole } from '@/role/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UserRoleDto } from '../dtos';
import { setupUserTest, theLegend27 } from '../test';

describe('UserRoleService', () => {
    describe('getAllRolesForUser', () => {
        it('should return 1 role initially (pre-seeded)', async () => {
            const { userRoleService } = await setupUserTest();
            expect(await userRoleService.getAllRolesForUser(theLegend27.id)).toHaveLength(1);
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { userRoleService } = await setupUserTest();
            await expect(userRoleService.getAllRolesForUser(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('assignRoleToUser', () => {
        it('should return a UserRoleDto', async () => {
            const { userRoleService, roleDb } = await setupUserTest();
            const newRole = roleDb.add('editor');
            const result = await userRoleService.assignRoleToUser(newRole.id, theLegend27.id);
            expect(result).toBeInstanceOf(UserRoleDto);
            expect(result.userId).toBe(theLegend27.id);
            expect(result.roleId).toBe(newRole.id);
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { userRoleService } = await setupUserTest();
            await expect(userRoleService.assignRoleToUser(seedRole.id, nanoid())).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a NotFoundException when role not found', async () => {
            const { userRoleService } = await setupUserTest();
            await expect(userRoleService.assignRoleToUser(nanoid(), theLegend27.id)).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when role already assigned', async () => {
            const { userRoleService } = await setupUserTest();
            await expect(userRoleService.assignRoleToUser(seedRole.id, theLegend27.id)).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('isRoleAssignedToAnyUser', () => {
        it('should return false for a role not assigned to any user', async () => {
            const { userRoleService, roleDb } = await setupUserTest();
            const otherRole = roleDb.add('other');
            expect(await userRoleService.isRoleAssignedToAnyUser(otherRole.id)).toBe(false);
        });

        it('should return true for the pre-seeded role assignment', async () => {
            const { userRoleService } = await setupUserTest();
            expect(await userRoleService.isRoleAssignedToAnyUser(seedRole.id)).toBe(true);
        });
    });

    describe('assignRolesToUser', () => {
        it('should return an array of UserRoleDtos', async () => {
            const { userRoleService, roleDb } = await setupUserTest();
            const role1 = roleDb.add('editor');
            const role2 = roleDb.add('viewer');
            await expect(userRoleService.assignRolesToUser(theLegend27.id, [role1.id, role2.id])).resolves.toHaveLength(
                2
            );
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { userRoleService, roleDb } = await setupUserTest();
            const newRole = roleDb.add('editor');
            await expect(userRoleService.assignRolesToUser(nanoid(), [newRole.id])).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a NotFoundException when a role is not found', async () => {
            const { userRoleService } = await setupUserTest();
            await expect(userRoleService.assignRolesToUser(theLegend27.id, [nanoid()])).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should silently skip already-assigned roles', async () => {
            const { userRoleService, roleDb } = await setupUserTest();
            const newRole = roleDb.add('editor');
            await expect(
                userRoleService.assignRolesToUser(theLegend27.id, [seedRole.id, newRole.id])
            ).resolves.toHaveLength(2);
        });
    });
});
