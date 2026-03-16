import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { PRISMA_CLIENT, PrismaLikeClient } from './provide-prisma';

@Injectable()
export class DatabaseService<TClient extends PrismaLikeClient = PrismaLikeClient>
    implements OnModuleInit, OnApplicationShutdown
{
    public get prisma() {
        return this._prisma;
    }
    private readonly _prisma: TClient;

    constructor(@Inject(PRISMA_CLIENT) prismaClient: TClient) {
        this._prisma = prismaClient;
    }

    public async onModuleInit() {
        await this.prisma.$connect();
    }

    public async onApplicationShutdown() {
        await this.prisma.$disconnect();
    }
}
