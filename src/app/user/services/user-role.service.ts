import { RoleService } from '@/app/role/services';
import { isArrayEmpty } from '@dnd-mapp/shared-utils';
import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRoleRepository } from '../repositories';
import { UserService } from './user.service';

@Injectable()
export class UserRoleService {
    private readonly logger = new Logger(UserRoleService.name);
    private readonly userRoleRepository: UserRoleRepository;
    private readonly userService: UserService;
    private readonly roleService: RoleService;

    constructor(
        userRoleRepository: UserRoleRepository,
        userService: UserService,
        @Inject(forwardRef(() => RoleService)) roleService: RoleService
    ) {
        this.userRoleRepository = userRoleRepository;
        this.userService = userService;
        this.roleService = roleService;
    }

    public async getAllRolesForUser(userId: string) {
        const user = await this.userService.getById(userId);

        if (!user) {
            this.logger.error(`Failed to retrieve roles: User with ID "${userId}" not found`);
            throw new NotFoundException(`User with ID "${userId}" was not found`);
        }
        this.logger.log(`Found user "${userId}", proceeding to fetch assigned roles`);
        return await this.userRoleRepository.findAllRolesForUser(userId);
    }

    public async assignRoleToUser(roleId: string, userId: string) {
        const user = await this.userService.getById(userId);
        const role = await this.roleService.getById(roleId);

        if (!user) {
            this.logger.warn(`Failed to assign role: User with ID ${userId} not found`);
            throw new NotFoundException(`User with ID "${userId}" was not found.`);
        }
        if (!role) {
            this.logger.warn(`Failed to assign role: Role with ID ${roleId} not found`);
            throw new NotFoundException(`Role with ID "${roleId}" was not found.`);
        }
        if (await this.isRoleAssignedToUser(roleId, userId)) {
            this.logger.warn(`Conflict: Role ${roleId} is already assigned to user ${userId}`);
            throw new ConflictException(`User already has the role "${roleId}" assigned.`);
        }
        return await this.userRoleRepository.assignRoleToUser(roleId, userId);
    }

    public async isRoleAssignedToAnyUser(roleId: string) {
        const users = await this.userRoleRepository.findAllUsersByRole(roleId);
        return !isArrayEmpty(users);
    }

    private async getRoleForUser(roleId: string, userId: string) {
        return await this.userRoleRepository.findRoleForUser(roleId, userId);
    }

    private async isRoleAssignedToUser(roleId: string, userId: string) {
        const userRole = await this.getRoleForUser(roleId, userId);
        return Boolean(userRole);
    }
}
