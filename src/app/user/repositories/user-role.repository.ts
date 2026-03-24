import { PrismaClient } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database';
import { recordToRoleDto } from '../../role';
import { selectedUserRoleAttributes } from './functions';

@Injectable()
export class UserRoleRepository {
    private readonly logger = new Logger(UserRoleRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
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
}
