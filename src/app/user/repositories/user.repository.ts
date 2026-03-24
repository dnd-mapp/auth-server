import { PrismaClient } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database';
import { CreateUserDto, GetUserQueryParams, UpdateUserDto } from '../dtos';
import { recordsToUserDtos, recordToUserDto, selectedUserAttributes } from './functions';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll(queryParams?: GetUserQueryParams) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.user.findMany({
                select: { ...selectedUserAttributes },
                ...(queryParams?.includeDeactivated ? {} : { where: { deletedAt: null } }),
                orderBy: { username: 'asc' },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch all users`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving users', {
                cause: error,
            });
        }
        return recordsToUserDtos(queryResult);
    }

    public async findById(id: string, params?: GetUserQueryParams) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.user.findUnique({
                select: { ...selectedUserAttributes },
                where: { id: id, ...(params?.includeDeactivated ? {} : { deletedAt: null }) },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch user with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the user record', {
                cause: error,
            });
        }
        if (!queryResult) {
            return null;
        }
        return recordToUserDto(queryResult);
    }

    public async findByUsername(username: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.user.findUnique({
                select: { ...selectedUserAttributes },
                where: { username: username },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch user with username "${username}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the user record', {
                cause: error,
            });
        }
        if (!queryResult) {
            return null;
        }
        return recordToUserDto(queryResult);
    }

    public async update(id: string, data: UpdateUserDto) {
        const { username } = data;

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.user.update({
                select: { ...selectedUserAttributes },
                where: { id: id },
                data: {
                    username: username,
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to update database record for user ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while updating the user record', {
                cause: error,
            });
        }
        return recordToUserDto(updated);
    }

    public async create(data: CreateUserDto) {
        const { username } = data;

        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.user.create({
                select: { ...selectedUserAttributes },
                data: {
                    username: username,
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to create database record for username "${username}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while creating the user record', {
                cause: error,
            });
        }
        return recordToUserDto(created);
    }

    public async softDeleteById(id: string) {
        const { error } = await tryCatch(
            this.databaseService.prisma.user.update({
                where: { id: id },
                data: { deletedAt: new Date() },
            })
        );

        if (error) {
            this.logger.error(`Failed to perform soft delete for user with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while deactivating the user', {
                cause: error,
            });
        }
    }

    public async purgeById(id: string) {
        const { error } = await tryCatch(this.databaseService.prisma.user.delete({ where: { id: id } }));

        if (error) {
            this.logger.error(`Failed to permanently delete for user with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while permanently delete the user', {
                cause: error,
            });
        }
    }
}
