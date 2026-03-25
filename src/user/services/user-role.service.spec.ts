import { seedRole } from '@/role/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UserRoleDto } from '../dtos';
import { setupUserTest, theLegend27 } from '../test';

describe('UserRoleService', () => {
    describe('getAllRolesForUser', () => {
        it('should return roles for user (empty initially)', async () => {
            const { userRoleService } = await setupUserTest();
            expect(await userRoleService.getAllRolesForUser(theLegend27.id)).toHaveLength(0);
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { userRoleService } = await setupUserTest();
            await expect(userRoleService.getAllRolesForUser(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('assignRoleToUser', () => {
        it('should return a UserRoleDto', async () => {
            const { userRoleService } = await setupUserTest();
            const result = await userRoleService.assignRoleToUser(seedRole.id, theLegend27.id);
            expect(result).toBeInstanceOf(UserRoleDto);
            expect(result.userId).toBe(theLegend27.id);
            expect(result.roleId).toBe(seedRole.id);
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
            await userRoleService.assignRoleToUser(seedRole.id, theLegend27.id);
            await expect(userRoleService.assignRoleToUser(seedRole.id, theLegend27.id)).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('isRoleAssignedToAnyUser', () => {
        it('should return false initially', async () => {
            const { userRoleService } = await setupUserTest();
            expect(await userRoleService.isRoleAssignedToAnyUser(seedRole.id)).toBe(false);
        });

        it('should return true after assigning', async () => {
            const { userRoleService } = await setupUserTest();
            await userRoleService.assignRoleToUser(seedRole.id, theLegend27.id);
            expect(await userRoleService.isRoleAssignedToAnyUser(seedRole.id)).toBe(true);
        });
    });
});
