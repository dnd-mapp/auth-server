import { Prisma, PrismaClient, User as PrismaUser } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database';
import { UserDto } from './dtos/user.dto';

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

    public async findAll() {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.user.findMany({
                select: { ...selectedUserAttributes },
                where: { removedAt: null },
            })
        );

        if (error) {
            this.logger.error(`Database error fetching users: ${error.message}`, error.stack);
            throw error;
        }
        return recordsToUserDtos(queryResult);
    }

    public async findById(id: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.user.findUnique({
                select: { ...selectedUserAttributes },
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Database error fetching user with ID "${id}": ${error.message}`, error.stack);
            throw error;
        }
        if (!queryResult) {
            return null;
        }
        return recordToUserDto(queryResult);
    }
}
