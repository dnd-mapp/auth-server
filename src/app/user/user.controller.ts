import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    @Get()
    public async getAll() {
        this.logger.log('Fetching all users');
        return await this.userService.getAll();
    }
}
