import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RoleRepository } from '../repositories';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);
    private readonly roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    public async getAll() {
        return await this.roleRepository.findAll();
    }

    public async getById(id: string) {
        return await this.roleRepository.findById(id);
    }

    public async update(id: string, data: UpdateRoleDto) {
        const byId = await this.getById(id);
        const { name } = data;

        if (byId === null) {
            this.logger.warn(`Update failed: Role with ID "${id}" not found`);
            throw new NotFoundException(`Role with ID "${id}" not found`);
        }
        if (await this.isNameTaken(name, id)) {
            this.logger.warn(`Update failed: Role "${name}" is already taken`);
            throw new ConflictException(`Role "${name}" is already in use`);
        }
        this.logger.log(`Updating role ID "${id}" with new data`);

        return await this.roleRepository.update(id, data);
    }

    public async create(data: CreateRoleDto) {
        const { name } = data;

        if (await this.isNameTaken(name)) {
            this.logger.warn(`Role creation failed: Role "${name}" is already taken`);
            throw new ConflictException(`Role "${name}" is already in use`);
        }
        this.logger.log(`Creating new role record: "${name}"`);

        return await this.roleRepository.create(data);
    }

    public async removeById(id: string) {
        const byId = await this.getById(id);

        if (byId == null) {
            this.logger.warn(`Failed to delete role: No role found with ID "${id}"`);
            throw new NotFoundException(`Role with ID "${id}" not found`);
        }
        await this.roleRepository.deleteById(id);
    }

    private async getByName(name: string) {
        return await this.roleRepository.findByName(name);
    }

    private async isNameTaken(name: string, roleId?: string) {
        const byName = await this.getByName(name);
        return byName && (!roleId || byName.id !== roleId);
    }
}
