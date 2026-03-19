import { Prisma, PrismaClient, User as PrismaUser } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database';
import { GetUserQueryParams, UserDto } from './dtos';

export function recordToUserDto(record: PrismaUser) {
    const dto = new UserDto();

    dto.id = record.id;
    dto.username = record.username;
    dto.removedAt = record.removedAt;
    return dto;
}

export function recordsToUserDtos(records: PrismaUser[]) {
    return records.map((record) => recordToUserDto(record));
}

export const selectedUserAttributes: Prisma.UserSelect = {
    id: true,
    username: true,
    removedAt: true,
};

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
                ...(queryParams?.includeDeactivated ? {} : { where: { removedAt: null } }),
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
                where: { id: id, ...(params?.includeDeactivated ? {} : { removedAt: null }) },
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

    public async softDeleteById(id: string) {
        const { error } = await tryCatch(
            this.databaseService.prisma.user.update({
                where: { id: id },
                data: { removedAt: new Date() },
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
