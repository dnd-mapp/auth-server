import { PasswordService } from '@/password';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientTypes } from '../client.constants';
import { CreateClientDto, UpdateClientDto } from '../dtos';
import { ClientRepository } from '../repositories';

@Injectable()
export class ClientService {
    private readonly logger = new Logger(ClientService.name);
    private readonly clientRepository: ClientRepository;
    private readonly passwordService: PasswordService;

    constructor(clientRepository: ClientRepository, passwordService: PasswordService) {
        this.clientRepository = clientRepository;
        this.passwordService = passwordService;
    }

    public async getAll() {
        return await this.clientRepository.findAll();
    }

    public async getById(clientId: string) {
        return await this.clientRepository.findById(clientId);
    }

    public async update(clientId: string, data: UpdateClientDto) {
        const byId = await this.getById(clientId);
        const { name, clientType, clientSecret } = data;

        if (byId === null) {
            this.logger.warn(`Update failed: Client with ID "${clientId}" not found`);
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        if (await this.isNameTaken(name, clientId)) {
            this.logger.warn(`Update failed: Client "${name}" is already taken`);
            throw new ConflictException(`Client "${name}" is already in use`);
        }
        this.validateSecretConstraints(clientType, clientSecret);

        const hashedSecret = clientSecret ? await this.passwordService.hash(clientSecret) : null;

        this.logger.log(`Updating client ID "${clientId}" with new data`);
        return await this.clientRepository.update(clientId, { ...data, clientSecret: hashedSecret });
    }

    public async create(data: CreateClientDto) {
        const { name, clientType, clientSecret } = data;

        if (await this.isNameTaken(name)) {
            this.logger.warn(`Client creation failed: Client "${name}" is already taken`);
            throw new ConflictException(`Client "${name}" is already in use`);
        }
        this.validateSecretConstraints(clientType, clientSecret);

        const hashedSecret = clientSecret ? await this.passwordService.hash(clientSecret) : null;

        this.logger.log(`Creating new client record: "${name}"`);
        return await this.clientRepository.create({ ...data, clientSecret: hashedSecret });
    }

    public async removeById(clientId: string) {
        const byId = await this.getById(clientId);

        if (byId == null) {
            this.logger.warn(`Failed to delete client: No client found with ID "${clientId}"`);
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        await this.clientRepository.deleteById(clientId);
    }

    public async verifyClientSecret(clientId: string, secret: string): Promise<boolean> {
        const raw = await this.clientRepository.findRawById(clientId);

        if (!raw?.clientSecret) {
            return false;
        }
        return this.passwordService.verify(raw.clientSecret, secret);
    }

    public parseClientSecretBasic(authHeader: string): { clientId: string; secret: string } {
        if (!authHeader.startsWith('Basic ')) {
            throw new BadRequestException('invalid_request');
        }
        const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
        const separatorIndex = decoded.indexOf(':');

        if (separatorIndex === -1) {
            throw new BadRequestException('invalid_request');
        }
        return {
            clientId: decoded.slice(0, separatorIndex),
            secret: decoded.slice(separatorIndex + 1),
        };
    }

    private validateSecretConstraints(clientType: string, clientSecret?: string) {
        if (clientType === ClientTypes.CONFIDENTIAL && !clientSecret) {
            throw new BadRequestException('Confidential clients must provide a client_secret');
        }
        if (clientType === ClientTypes.PUBLIC && clientSecret) {
            throw new BadRequestException('Public clients must not provide a client_secret');
        }
    }

    private async getByName(name: string) {
        return await this.clientRepository.findByName(name);
    }

    private async isNameTaken(name: string, clientId?: string) {
        const byName = await this.getByName(name);
        return byName && (!clientId || byName.id !== clientId);
    }
}
