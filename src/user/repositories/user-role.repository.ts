import { DatabaseService } from '@/database';
import { PrismaClient } from '@/prisma/client';
import { recordToRoleDto } from '@/role/repositories';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
    recordsToUserDtos,
    recordToUserRoleDto,
    selectedUserAttributes,
    selectedUserRoleAttributes,
} from './functions';

@Injectable()
export class UserRoleRepository {
    private readonly logger = new Logger(UserRoleRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findRoleForUser(roleId: string, userId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.userRole.findUnique({
                select: { ...selectedUserRoleAttributes },
                where: {
                    userId_roleId: {
                        userId: userId,
                        roleId: roleId,
                    },
                },
            })
        );

        if (error) {
            this.logger.error(`Database error searching for user-role: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error checking role assignment', {
                cause: error,
            });
        }
        if (queryResult) return recordToUserRoleDto(queryResult);
        return null;
    }

    public async findAllRolesForUser(userId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.userRole.findMany({
                select: { ...selectedUserRoleAttributes },
                where: { userId: userId },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch all roles for user ID "${userId}" from the database`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving user roles', {
                cause: error,
            });
        }
        return queryResult.map(({ role }) => recordToRoleDto(role));
    }

    public async findAllUsersByRole(roleId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.user.findMany({
                select: { ...selectedUserAttributes },
                where: {
                    roles: {
                        some: {
                            roleId: roleId,
                        },
                    },
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch users for role ID "${roleId}"`, error.stack);
            throw new InternalServerErrorException(
                `An unexpected error occurred while retrieving users for role ID "${roleId}"`,
                {
                    cause: error,
                }
            );
        }
        return recordsToUserDtos(queryResult);
    }

    public async assignRoleToUser(roleId: string, userId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.userRole.create({
                select: { ...selectedUserRoleAttributes },
                data: {
                    userId: userId,
                    roleId: roleId,
                },
            })
        );

        if (error) {
            this.logger.error(`Database error creating user-role link: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to assign role in database', {
                cause: error,
            });
        }
        return recordToUserRoleDto(queryResult);
    }

    public async assignRolesToUser(userId: string, roleIds: string[]) {
        const { error: createError } = await tryCatch(
            this.databaseService.prisma.userRole.createMany({
                data: roleIds.map((roleId) => ({ userId: userId, roleId: roleId })),
                skipDuplicates: true,
            })
        );

        if (createError) {
            this.logger.error(
                `Database error bulk-assigning roles to user "${userId}": ${createError.message}`,
                createError.stack
            );
            throw new InternalServerErrorException('Failed to bulk-assign roles in database', {
                cause: createError,
            });
        }

        const { data: queryResult, error: fetchError } = await tryCatch(
            this.databaseService.prisma.userRole.findMany({
                select: { ...selectedUserRoleAttributes },
                where: { userId: userId, roleId: { in: roleIds } },
            })
        );

        if (fetchError) {
            this.logger.error(
                `Database error fetching assigned roles for user "${userId}": ${fetchError.message}`,
                fetchError.stack
            );
            throw new InternalServerErrorException('Failed to retrieve bulk-assigned roles from database', {
                cause: fetchError,
            });
        }
        return queryResult.map((record) => recordToUserRoleDto(record));
    }
}
