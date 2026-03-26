import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from '../dtos';
import { ClientRepository } from '../repositories';

@Injectable()
export class ClientService {
    private readonly logger = new Logger(ClientService.name);
    private readonly clientRepository: ClientRepository;

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;
    }

    public async getAll() {
        return await this.clientRepository.findAll();
    }

    public async getById(clientId: string) {
        return await this.clientRepository.findById(clientId);
    }

    public async update(clientId: string, data: UpdateClientDto) {
        const byId = await this.getById(clientId);
        const { name } = data;

        if (byId === null) {
            this.logger.warn(`Update failed: Client with ID "${clientId}" not found`);
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        if (await this.isNameTaken(name, clientId)) {
            this.logger.warn(`Update failed: Client "${name}" is already taken`);
            throw new ConflictException(`Client "${name}" is already in use`);
        }
        this.logger.log(`Updating client ID "${clientId}" with new data`);

        return await this.clientRepository.update(clientId, data);
    }

    public async create(data: CreateClientDto) {
        const { name } = data;

        if (await this.isNameTaken(name)) {
            this.logger.warn(`Client creation failed: Client "${name}" is already taken`);
            throw new ConflictException(`Client "${name}" is already in use`);
        }
        this.logger.log(`Creating new client record: "${name}"`);

        return await this.clientRepository.create(data);
    }

    public async removeById(clientId: string) {
        const byId = await this.getById(clientId);

        if (byId == null) {
            this.logger.warn(`Failed to delete client: No client found with ID "${clientId}"`);
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        await this.clientRepository.deleteById(clientId);
    }

    private async getByName(name: string) {
        return await this.clientRepository.findByName(name);
    }

    private async isNameTaken(name: string, clientId?: string) {
        const byName = await this.getByName(name);
        return byName && (!clientId || byName.id !== clientId);
    }
}
