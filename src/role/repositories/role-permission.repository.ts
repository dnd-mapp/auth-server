import { DatabaseService } from '@/database';
import { PrismaClient } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RolePermissionDto } from '../dtos';

@Injectable()
export class RolePermissionRepository {
    private readonly logger = new Logger(RolePermissionRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findPermissionForRole(roleId: string, permissionId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.rolePermission.findUnique({
                select: { roleId: true, permissionId: true },
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId,
                    },
                },
            })
        );

        if (error) {
            this.logger.error(`Database error searching for role-permission: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error checking permission assignment', {
                cause: error,
            });
        }
        if (queryResult) {
            const dto = new RolePermissionDto();

            dto.roleId = queryResult.roleId;
            dto.permissionId = queryResult.permissionId;
            return dto;
        }
        return null;
    }

    public async findAllPermissionsForRole(roleId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.rolePermission.findMany({
                select: { roleId: true, permissionId: true },
                where: { roleId },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch all permissions for role ID "${roleId}" from the database`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving role permissions', {
                cause: error,
            });
        }
        return queryResult.map((r) => {
            const dto = new RolePermissionDto();

            dto.roleId = r.roleId;
            dto.permissionId = r.permissionId;
            return dto;
        });
    }

    public async assignPermissionToRole(roleId: string, permissionId: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.rolePermission.create({
                select: { roleId: true, permissionId: true },
                data: { roleId, permissionId },
            })
        );

        if (error) {
            this.logger.error(`Database error creating role-permission link: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to assign permission in database', {
                cause: error,
            });
        }
        const dto = new RolePermissionDto();

        dto.roleId = queryResult.roleId;
        dto.permissionId = queryResult.permissionId;
        return dto;
    }

    public async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
        const { error: createError } = await tryCatch(
            this.databaseService.prisma.rolePermission.createMany({
                data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
                skipDuplicates: true,
            })
        );

        if (createError) {
            this.logger.error(
                `Database error bulk-assigning permissions to role "${roleId}": ${createError.message}`,
                createError.stack
            );
            throw new InternalServerErrorException('Failed to bulk-assign permissions in database', {
                cause: createError,
            });
        }

        const { data: queryResult, error: fetchError } = await tryCatch(
            this.databaseService.prisma.rolePermission.findMany({
                select: { roleId: true, permissionId: true },
                where: { roleId, permissionId: { in: permissionIds } },
            })
        );

        if (fetchError) {
            this.logger.error(
                `Database error fetching assigned permissions for role "${roleId}": ${fetchError.message}`,
                fetchError.stack
            );
            throw new InternalServerErrorException('Failed to retrieve bulk-assigned permissions from database', {
                cause: fetchError,
            });
        }
        return queryResult.map((r) => {
            const dto = new RolePermissionDto();

            dto.roleId = r.roleId;
            dto.permissionId = r.permissionId;
            return dto;
        });
    }

    public async removePermissionFromRole(roleId: string, permissionId: string) {
        const { error } = await tryCatch(
            this.databaseService.prisma.rolePermission.delete({
                where: {
                    roleId_permissionId: { roleId, permissionId },
                },
            })
        );

        if (error) {
            this.logger.error(`Database error removing role-permission: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to remove permission from role in database', {
                cause: error,
            });
        }
    }

    public async removePermissionsFromRole(roleId: string, permissionIds: string[]) {
        const { error } = await tryCatch(
            this.databaseService.prisma.rolePermission.deleteMany({
                where: {
                    roleId,
                    permissionId: { in: permissionIds },
                },
            })
        );

        if (error) {
            this.logger.error(
                `Database error bulk-removing permissions from role "${roleId}": ${error.message}`,
                error.stack
            );
            throw new InternalServerErrorException('Failed to remove permissions from role in database', {
                cause: error,
            });
        }
    }
}
