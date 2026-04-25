import { PrismaClient } from '@/prisma/client';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SigningKey } from './domain';

@Injectable()
export class KeyRepository {
    private readonly logger = new Logger(KeyRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async create(data: { privateKey: string; publicKey: string }): Promise<SigningKey> {
        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.signingKey.create({
                data: {
                    privateKey: data.privateKey,
                    publicKey: data.publicKey,
                },
            })
        );

        if (error) {
            this.logger.error('Failed to create signing key record', error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while creating the signing key', {
                cause: error,
            });
        }
        return created;
    }

    public async findActive(): Promise<SigningKey | null> {
        const { data: result, error } = await tryCatch(
            this.databaseService.prisma.signingKey.findFirst({
                where: { revokedAt: null },
                orderBy: { createdAt: 'desc' },
            })
        );

        if (error) {
            this.logger.error('Failed to fetch active signing key', error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the signing key', {
                cause: error,
            });
        }
        return result ?? null;
    }

    public async findAllActive(): Promise<SigningKey[]> {
        const { data: results, error } = await tryCatch(
            this.databaseService.prisma.signingKey.findMany({
                where: { revokedAt: null },
                orderBy: { createdAt: 'desc' },
            })
        );

        if (error) {
            this.logger.error('Failed to fetch active signing keys', error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving signing keys', {
                cause: error,
            });
        }
        return results;
    }

    public async revokeById(kid: string): Promise<void> {
        const { error } = await tryCatch(
            this.databaseService.prisma.signingKey.update({
                where: { kid },
                data: { revokedAt: new Date() },
            })
        );

        if (error) {
            this.logger.error(`Failed to revoke signing key "${kid}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while revoking the signing key', {
                cause: error,
            });
        }
    }
}
