import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dtos';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
    private readonly logger = new Logger(PermissionService.name);
    private readonly permissionRepository: PermissionRepository;

    constructor(permissionRepository: PermissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public async getAll() {
        return await this.permissionRepository.findAll();
    }

    public async getById(id: string) {
        return await this.permissionRepository.findById(id);
    }

    public async update(id: string, data: UpdatePermissionDto) {
        const byId = await this.getById(id);
        const { name } = data;

        if (byId === null) {
            this.logger.warn(`Update failed: Permission with ID "${id}" not found`);
            throw new NotFoundException(`Permission with ID "${id}" not found`);
        }
        if (await this.isNameTaken(name, id)) {
            this.logger.warn(`Update failed: Permission "${name}" is already taken`);
            throw new ConflictException(`Permission "${name}" is already in use`);
        }
        this.logger.log(`Updating permission ID "${id}" with new data`);

        return await this.permissionRepository.update(id, data);
    }

    public async create(data: CreatePermissionDto) {
        const { name } = data;

        if (await this.isNameTaken(name)) {
            this.logger.warn(`Permission creation failed: Permission "${name}" is already taken`);
            throw new ConflictException(`Permission "${name}" is already in use`);
        }
        this.logger.log(`Creating new permission record: "${name}"`);

        return await this.permissionRepository.create(data);
    }

    public async removeById(id: string) {
        const byId = await this.getById(id);

        if (byId == null) {
            this.logger.warn(`Failed to delete permission: No permission found with ID "${id}"`);
            throw new NotFoundException(`Permission with ID "${id}" not found`);
        }
        await this.permissionRepository.deleteById(id);
    }

    private async getByName(name: string) {
        return await this.permissionRepository.findByName(name);
    }

    private async isNameTaken(name: string, permissionId?: string) {
        const byName = await this.getByName(name);
        return byName && (!permissionId || byName.id !== permissionId);
    }
}
