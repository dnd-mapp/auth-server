import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRoleRepository } from '../repositories';
import { UserService } from './user.service';

@Injectable()
export class UserRoleService {
    private readonly logger = new Logger(UserRoleService.name);
    private readonly userRoleRepository: UserRoleRepository;
    private readonly userService: UserService;

    constructor(userRoleRepository: UserRoleRepository, userService: UserService) {
        this.userRoleRepository = userRoleRepository;
        this.userService = userService;
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
}
