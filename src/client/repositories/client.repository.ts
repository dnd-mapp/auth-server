import { PrismaClient } from '@/prisma/client';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from '../dtos';
import { recordsToClientDtos, recordToClientDto, selectedClientAttributes } from './functions';

@Injectable()
export class ClientRepository {
    private readonly logger = new Logger(ClientRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.client.findMany({
                select: { ...selectedClientAttributes },
                orderBy: { name: 'asc' },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch all clients`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving clients', {
                cause: error,
            });
        }
        return recordsToClientDtos(queryResult);
    }

    public async findById(id: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.client.findUnique({
                select: { ...selectedClientAttributes },
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch client with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the client record', {
                cause: error,
            });
        }
        if (!queryResult) {
            return null;
        }
        return recordToClientDto(queryResult);
    }

    public async findByName(name: string) {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.client.findUnique({
                select: { ...selectedClientAttributes },
                where: { name: name },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch client with name "${name}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the client record', {
                cause: error,
            });
        }
        if (!queryResult) {
            return null;
        }
        return recordToClientDto(queryResult);
    }

    public async findRawById(id: string): Promise<{ clientSecret: string | null } | null> {
        const { data: queryResult, error } = await tryCatch(
            this.databaseService.prisma.client.findUnique({
                select: { clientSecret: true },
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch client secret for ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving the client record', {
                cause: error,
            });
        }
        return queryResult;
    }

    public async update(id: string, data: UpdateClientDto & { clientSecret?: string | null }) {
        const { name, allowedUris, clientType, clientSecret } = data;

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.client.update({
                select: { ...selectedClientAttributes },
                where: { id: id },
                data: {
                    name: name,
                    clientType: clientType,
                    clientSecret: clientSecret,
                    allowedUris: { deleteMany: {}, create: allowedUris.map((uri) => ({ uri })) },
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to update database record for client ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while updating the client record', {
                cause: error,
            });
        }
        return recordToClientDto(updated);
    }

    public async create(data: CreateClientDto & { clientSecret?: string | null }) {
        const { name, allowedUris, clientType, clientSecret } = data;

        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.client.create({
                select: { ...selectedClientAttributes },
                data: {
                    name: name,
                    clientType: clientType,
                    clientSecret: clientSecret,
                    allowedUris: { create: allowedUris.map((uri) => ({ uri })) },
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to create database record for client "${name}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while creating the client record', {
                cause: error,
            });
        }
        return recordToClientDto(created);
    }

    public async deleteById(id: string) {
        const { error } = await tryCatch(
            this.databaseService.prisma.client.delete({
                where: { id: id },
            })
        );

        if (error) {
            this.logger.error(`Failed to delete client with ID "${id}"`, error.stack);
            throw new InternalServerErrorException('An unexpected error occurred while deleting the client', {
                cause: error,
            });
        }
    }
}
