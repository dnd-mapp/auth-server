import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetUserQueryParams } from './dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async getAll() {
        return await this.userRepository.findAll();
    }

    public async getById(id: string, params?: GetUserQueryParams) {
        return await this.userRepository.findById(id, params);
    }

    public async removeById(id: string) {
        const byId = await this.getById(id);

        if (byId == null) {
            this.logger.warn(`Failed to soft delete user: No user found with ID "${id}"`);
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        await this.userRepository.softDeleteById(id);
    }

    public async purgeById(id: string) {
        const byId = await this.getById(id, { includeDeactivated: true });

        if (byId == null) {
            this.logger.warn(`Failed to purge user: No user found with ID "${id}"`);
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        await this.userRepository.purgeById(id);
    }
}
