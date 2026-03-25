import { RoleDto } from '@/role/dtos';
import { seedRole } from '@/role/test';
import { Logger } from '@nestjs/common';
import { UserDto, UserRoleDto } from '../dtos';
import { setupUserTest, theLegend27 } from '../test';

describe('UserRoleRepository', () => {
    describe('findRoleForUser', () => {
        it('should return a UserRoleDto after assigning', async () => {
            const { userRoleRepository } = await setupUserTest();
            Logger.overrideLogger(false);
            await userRoleRepository.assignRoleToUser(seedRole.id, theLegend27.id);
            expect(await userRoleRepository.findRoleForUser(seedRole.id, theLegend27.id)).toBeInstanceOf(UserRoleDto);
        });

        it('should return null when not assigned', async () => {
            const { userRoleRepository } = await setupUserTest();
            Logger.overrideLogger(false);
            expect(await userRoleRepository.findRoleForUser(seedRole.id, theLegend27.id)).toBeNull();
        });

        it('should throw a database error', async () => {
            const { userRoleRepository, databaseService } = await setupUserTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.userRole, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(userRoleRepository.findRoleForUser(seedRole.id, theLegend27.id)).rejects.toThrow();
        });
    });

    describe('findAllRolesForUser', () => {
        it('should return an empty array initially', async () => {
            const { userRoleRepository } = await setupUserTest();
            Logger.overrideLogger(false);
            expect(await userRoleRepository.findAllRolesForUser(theLegend27.id)).toHaveLength(0);
        });

        it('should return roles after assignment', async () => {
            const { userRoleRepository } = await setupUserTest();
            Logger.overrideLogger(false);
            await userRoleRepository.assignRoleToUser(seedRole.id, theLegend27.id);
            const roles = await userRoleRepository.findAllRolesForUser(theLegend27.id);
            expect(roles).toHaveLength(1);
            expect(roles[0]).toBeInstanceOf(RoleDto);
        });

        it('should throw a database error', async () => {
            const { userRoleRepository, databaseService } = await setupUserTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.userRole, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(userRoleRepository.findAllRolesForUser(theLegend27.id)).rejects.toThrow();
        });
    });

    describe('findAllUsersByRole', () => {
        it('should return a UserDto array', async () => {
            const { userRoleRepository, databaseService } = await setupUserTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.user, 'findMany').mockResolvedValueOnce([
                {
                    id: theLegend27.id,
                    username: theLegend27.username,
                    roles: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ] as unknown as Awaited<ReturnType<typeof databaseService.prisma.user.findMany>>);
            const users = await userRoleRepository.findAllUsersByRole(seedRole.id);
            expect(users).toHaveLength(1);
            expect(users[0]).toBeInstanceOf(UserDto);
        });

        it('should throw a database error', async () => {
            const { userRoleRepository, databaseService } = await setupUserTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.user, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(userRoleRepository.findAllUsersByRole(seedRole.id)).rejects.toThrow();
        });
    });

    describe('assignRoleToUser', () => {
        it('should return a UserRoleDto', async () => {
            const { userRoleRepository } = await setupUserTest();
            Logger.overrideLogger(false);
            const result = await userRoleRepository.assignRoleToUser(seedRole.id, theLegend27.id);
            expect(result).toBeInstanceOf(UserRoleDto);
            expect(result.userId).toBe(theLegend27.id);
            expect(result.roleId).toBe(seedRole.id);
        });

        it('should throw a database error', async () => {
            const { userRoleRepository, databaseService } = await setupUserTest();
            Logger.overrideLogger(false);
            vi.spyOn(databaseService.prisma.userRole, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(userRoleRepository.assignRoleToUser(seedRole.id, theLegend27.id)).rejects.toThrow();
        });
    });
});
