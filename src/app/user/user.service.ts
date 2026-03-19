import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetUserQueryParams, UpdateUserDto } from './dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async getAll(queryParams?: GetUserQueryParams) {
        return await this.userRepository.findAll(queryParams);
    }

    public async getById(id: string, params?: GetUserQueryParams) {
        return await this.userRepository.findById(id, params);
    }

    public async update(id: string, data: UpdateUserDto) {
        const byId = await this.getById(id);
        const { username } = data;

        if (byId === null) {
            this.logger.warn(`Update failed: User with ID "${id}" not found`);
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        if (await this.isUsernameTaken(username, id)) {
            this.logger.warn(`Update failed: Username "${username}" is already taken`);
            throw new ConflictException(`Username "${username}" is already in use`);
        }
        this.logger.log(`Updating user ID "${id}" with new data`);

        return await this.userRepository.update(id, data);
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

    private async getByUsername(username: string) {
        return await this.userRepository.findByUsername(username);
    }

    private async isUsernameTaken(username: string, userId?: string) {
        const byUsername = await this.getByUsername(username);
        return byUsername && (!userId || byUsername.id !== userId);
    }
}
