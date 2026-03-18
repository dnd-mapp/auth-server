import { Prisma, PrismaClient, User as PrismaUser } from '@/prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { UserDto } from './dtos/user.dto';

export function recordToUserDto(record: PrismaUser) {
    const dto = new UserDto();

    dto.id = record.id;
    dto.username = record.username;
    return dto;
}

export function recordsToUserDtos(records: PrismaUser[]) {
    return records.map((record) => recordToUserDto(record));
}

export const selectedUserAttributes: Prisma.UserSelect = {
    id: true,
    username: true,
};

@Injectable()
export class UserRepository {
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        const queryResult = await this.databaseService.prisma.user.findMany({
            select: { ...selectedUserAttributes },
        });

        return recordsToUserDtos(queryResult);
    }
}
