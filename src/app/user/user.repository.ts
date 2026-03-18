import { PrismaClient } from '@/prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class UserRepository {
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        return await this.databaseService.prisma.user.findMany();
    }
}
