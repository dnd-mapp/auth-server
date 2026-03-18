import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
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
}
