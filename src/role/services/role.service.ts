import { UserRoleService } from '@/user/services';
import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RoleRepository } from '../repositories';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);
    private readonly roleRepository: RoleRepository;
    private readonly userRoleService: UserRoleService;

    constructor(
        roleRepository: RoleRepository,
        @Inject(forwardRef(() => UserRoleService)) userRoleService: UserRoleService
    ) {
        this.roleRepository = roleRepository;
        this.userRoleService = userRoleService;
    }

    public async getAll() {
        return await this.roleRepository.findAll();
    }

    public async getById(roleId: string) {
        return await this.roleRepository.findById(roleId);
    }

    public async update(roleId: string, data: UpdateRoleDto) {
        const byId = await this.getById(roleId);
        const { name } = data;

        if (byId === null) {
            this.logger.warn(`Update failed: Role with ID "${roleId}" not found`);
            throw new NotFoundException(`Role with ID "${roleId}" not found`);
        }
        if (await this.isNameTaken(name, roleId)) {
            this.logger.warn(`Update failed: Role "${name}" is already taken`);
            throw new ConflictException(`Role "${name}" is already in use`);
        }
        this.logger.log(`Updating role ID "${roleId}" with new data`);

        return await this.roleRepository.update(roleId, data);
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

    public async removeById(roleId: string) {
        const byId = await this.getById(roleId);

        if (byId == null) {
            this.logger.warn(`Failed to delete role: No role found with ID "${roleId}"`);
            throw new NotFoundException(`Role with ID "${roleId}" not found`);
        }
        if (await this.userRoleService.isRoleAssignedToAnyUser(roleId)) {
            this.logger.warn(`Failed to delete role: Role with ID "${roleId}" is still assigned to one or more users`);
            throw new ConflictException(
                `Role with ID "${roleId}" cannot be deleted because it is currently assigned to a user`
            );
        }
        await this.roleRepository.deleteById(roleId);
    }

    private async getByName(name: string) {
        return await this.roleRepository.findByName(name);
    }

    private async isNameTaken(name: string, roleId?: string) {
        const byName = await this.getByName(name);
        return byName && (!roleId || byName.id !== roleId);
    }
}
