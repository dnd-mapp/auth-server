import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    NotFoundException,
    Param,
    Put,
    Query,
} from '@nestjs/common';
import { GetUserQueryParams, UpdateUserDto, UserDto } from './dtos';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * Retrieve a list of users.
     *
     * @remarks Fetches all users from the database. Can be filtered to include
     * soft-deleted (deactivated) users via query parameters.
     *
     * @param queryParams Filtering options (e.g., includeDeactivated)
     * @returns A list of user records.
     * @throws {500} If the database query fails.
     */
    @Get()
    public async getAll(@Query() queryParams?: GetUserQueryParams): Promise<UserDto[]> {
        this.logger.log('Fetching all users');
        return await this.userService.getAll(queryParams);
    }

    /**
     * Retrieve a single user by ID.
     *
     * @remarks Finds a user record by its unique nanoid. Returns 404 if the user
     * does not exist or is soft-deleted (unless specified otherwise).
     *
     * @param userId The unique nanoid of the user.
     * @param queryParams Filtering options.
     * @returns The user object.
     * @throws {404} If no user is found with the provided ID.
     * @throws {500} If the database query fails.
     */
    @Get('/:userId')
    public async getById(@Param('userId') userId: string, @Query() queryParams?: GetUserQueryParams): Promise<UserDto> {
        this.logger.log(`Fetching user with ID "${userId}"`);
        const byId = await this.userService.getById(userId, queryParams);

        if (!byId) {
            this.logger.warn(`User lookup failed: ID "${userId}" not found`);
            throw new NotFoundException(`User with ID "${userId}" was not found`);
        }
        return byId;
    }

    /**
     * Update an existing user's details.
     *
     * @remarks Modifies user information based on the provided ID.
     * Validates that the username is not already taken by another user.
     *
     * @param userId The unique nanoid of the user.
     * @param data The updated user data (e.g., username).
     * @returns The updated user record.
     * @throws {404} If the user does not exist or is soft-deleted.
     * @throws {409} If the new username is already in use by another account.
     * @throws {500} If the database update fails.
     */
    @Put('/:userId')
    public async updateById(@Param('userId') userId: string, @Body() data: UpdateUserDto): Promise<UserDto> {
        this.logger.log(`Request to update user with ID "${userId}"`);

        return await this.userService.update(userId, data);
    }

    /**
     * Soft-delete a user.
     *
     * @remarks Deactivates a user by setting the `removedAt` timestamp.
     * The record remains in the database but will be hidden from standard lookups.
     *
     * @param userId The unique nanoid of the user to deactivate.
     * @throws {404} If the user does not exist or is already deleted.
     * @throws {500} If the database query fails.
     */
    @Delete('/:userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeById(@Param('userId') userId: string): Promise<void> {
        this.logger.log(`Initiating soft delete for user ID "${userId}"`);

        await this.userService.removeById(userId);

        this.logger.log(`User ID "${userId}" successfully marked as removed`);
    }

    /**
     * Permanently purge a user.
     *
     * @remarks Irreversibly deletes a user record from the database.
     * This action cannot be undone.
     *
     * @param userId The unique nanoid of the user to permanently remove.
     * @throws {404} If the user does not exist.
     * @throws {500} If the database query fails.
     */
    @Delete('/:userId/purge')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async purgeById(@Param('userId') userId: string): Promise<void> {
        this.logger.log(`Initiating purge for user ID "${userId}"`);

        await this.userService.purgeById(userId);

        this.logger.log(`User ID "${userId}" successfully removed permanently`);
    }
}
