import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    public async getById(id: string) {
        return await this.userRepository.findById(id);
    }

    public async removeById(id: string) {
        const byId = await this.getById(id);

        if (byId == null) {
            this.logger.warn(`Failed to delete user: No user found with ID "${id}"`);
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        await this.userRepository.softDeleteById(id);
    }
}
