import { Controller, Get, Logger, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * Retrieve a list of all active users.
     */
    @Get()
    public async getAll() {
        this.logger.log('Fetching all users');
        return await this.userService.getAll();
    }

    /**
     * Retrieve a single user by their unique ID.
     *
     * @param userId the nanoid of the user.
     * @returns The user object if found.
     */
    @Get('/:userId')
    public async getById(@Param('userId') userId: string) {
        this.logger.log(`Fetching user with ID "${userId}"`);
        const byId = await this.userService.getById(userId);

        if (!byId) {
            this.logger.warn(`User lookup failed: ID "${userId}" no found`);
            throw new NotFoundException(`User with ID "${userId}" was not found`);
        }
        return byId;
    }
}
