import { PrismaClient } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '@/database';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { recordsToRoleDtos, recordToRoleDto, selectedRoleAttributes } from './functions';

@Injectable()
export class RoleRepository {
    private readonly logger = new Logger(RoleRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.role.findMany({
                select: { ...selectedRoleAttributes },
                orderBy: { name: 'asc' },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch all roles`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving roles', {
                cause: error,
            });
        }
        return recordsToRoleDtos(queryResult);
    }

    public async findById(id: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.role.findUnique({
                select: { ...selectedRoleAttributes },
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch role with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the role record', {
                cause: error,
            });
        }
        if (!queryResult) {
            return null;
        }
        return recordToRoleDto(queryResult);
    }

    public async findByName(name: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.role.findUnique({
                select: { ...selectedRoleAttributes },
                where: { name: name },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch role with name "${name}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the role record', {
                cause: error,
            });
        }
        if (!queryResult) {
            return null;
        }
        return recordToRoleDto(queryResult);
    }

    public async update(id: string, data: UpdateRoleDto) {
        const { name } = data;

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.role.update({
                select: { ...selectedRoleAttributes },
                where: { id: id },
                data: {
                    name: name,
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to update database record for role ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while updating the role record', {
                cause: error,
            });
        }
        return recordToRoleDto(updated);
    }

    public async create(data: CreateRoleDto) {
        const { name } = data;

        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.role.create({
                select: { ...selectedRoleAttributes },
                data: {
                    name: name,
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to create database record for role "${name}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while creating the role record', {
                cause: error,
            });
        }
        return recordToRoleDto(created);
    }

    public async deleteById(id: string) {
        const { error } = await tryCatch(
            this.databaseService.prisma.role.delete({
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to delete role with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while deleting the role', {
                cause: error,
            });
        }
    }
}
