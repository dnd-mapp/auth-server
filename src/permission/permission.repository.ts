import { DatabaseService } from '@/database';
import { Prisma, PrismaClient, Permission as PrismaPermission } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePermissionDto, PermissionDto, UpdatePermissionDto } from './dtos';

export function recordToPermissionDto(record: PrismaPermission) {
    const dto = new PermissionDto();

    dto.id = record.id;
    dto.name = record.name;
    dto.createdAt = record.createdAt;
    dto.updatedAt = record.updatedAt;
    return dto;
}

export function recordsToPermissionDtos(records: PrismaPermission[]) {
    return records.map((record) => recordToPermissionDto(record));
}

export const selectedPermissionAttributes: Prisma.PermissionSelect = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
};

@Injectable()
export class PermissionRepository {
    private readonly logger = new Logger(PermissionRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.permission.findMany({
                select: { ...selectedPermissionAttributes },
                orderBy: { name: 'asc' },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch all permissions`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving permissions', {
                cause: error,
            });
        }
        return recordsToPermissionDtos(queryResult);
    }

    public async findById(id: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.permission.findUnique({
                select: { ...selectedPermissionAttributes },
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch permission with ID "${id}"`, error.stack);
            throw new InternalServerErrorException(
                'An unexpected error occurred while retrieving the permission record',
                {
                    cause: error,
                }
            );
        }
        if (!queryResult) {
            return null;
        }
        return recordToPermissionDto(queryResult);
    }

    public async findByName(name: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.permission.findUnique({
                select: { ...selectedPermissionAttributes },
                where: { name: name },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch permission with name "${name}"`, error.stack);
            throw new InternalServerErrorException(
                'An unexpected error occurred while retrieving the permission record',
                {
                    cause: error,
                }
            );
        }
        if (!queryResult) {
            return null;
        }
        return recordToPermissionDto(queryResult);
    }

    public async update(id: string, data: UpdatePermissionDto) {
        const { name } = data;

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.permission.update({
                select: { ...selectedPermissionAttributes },
                where: { id: id },
                data: {
                    name: name,
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to update database record for permission ID "${id}"`, error.stack);
            throw new InternalServerErrorException(
                'An unexpected error occurred while updating the permission record',
                {
                    cause: error,
                }
            );
        }
        return recordToPermissionDto(updated);
    }

    public async create(data: CreatePermissionDto) {
        const { name } = data;

        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.permission.create({
                select: { ...selectedPermissionAttributes },
                data: {
                    name: name,
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to create database record for permission "${name}"`, error.stack);
            throw new InternalServerErrorException(
                'An unexpected error occurred while creating the permission record',
                {
                    cause: error,
                }
            );
        }
        return recordToPermissionDto(created);
    }

    public async deleteById(id: string) {
        const { error } = await tryCatch(
            this.databaseService.prisma.permission.delete({
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to delete permission with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while deleting the permission', {
                cause: error,
            });
        }
    }
}
