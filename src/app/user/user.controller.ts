import { Controller, Get, Logger, NotFoundException, Param } from '@nestjs/common';
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

    @Get('/:user_id')
    public async getById(@Param('user_id') userId: string) {
        this.logger.log(`Fetching user with ID "${userId}"`);
        const byId = await this.userService.getById(userId);

        if (!byId) {
            this.logger.warn(`User lookup failed: ID "${userId}" no found`);
            throw new NotFoundException(`User with ID "${userId}" was not found`);
        }
        return byId;
    }
}
