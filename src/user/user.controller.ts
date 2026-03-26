import { RoleDto } from '@/role/dtos';
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
    Post,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { AssignRolesToUserDto, CreateUserDto, GetUserQueryParams, UpdateUserDto, UserDto, UserRoleDto } from './dtos';
import { UserRoleService, UserService } from './services';

@Controller('/users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    private readonly userService: UserService;
    private readonly userRoleService: UserRoleService;

    constructor(userService: UserService, userRoleService: UserRoleService) {
        this.userService = userService;
        this.userRoleService = userRoleService;
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
     * Create a new user.
     *
     * @remarks Registers a new user in the system. Validates that the
     * username is unique before persistence.
     *
     * @param data The user registration data (e.g., username).
     * @param response Fastify response object to set the Location header.
     * @returns The newly created user record.
     * @throws {409} If the username is already taken.
     * @throws {500} If the database insertion fails.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() data: CreateUserDto,
        @Res({ passthrough: true }) response: FastifyReply
    ): Promise<UserDto> {
        this.logger.log(`Received request to create a new user with username: "${data.username}"`);

        const created = await this.userService.create(data);

        response.headers({ location: `/users/${created.id}` });
        return created;
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

    /**
     * Retrieve all roles assigned to a user.
     *
     * @remarks Fetches a collection of roles currently associated with the specified user ID.
     *
     * @param userId The unique nanoid of the user.
     * @returns A list of roles assigned to the user.
     * @throws {404} If the user does not exist.
     * @throws {500} If the database query fails.
     */
    @Get('/:userId/roles')
    public async getRolesForUser(@Param('userId') userId: string): Promise<RoleDto[]> {
        this.logger.log(`Fetching all roles assigned to user ID "${userId}"`);

        return await this.userRoleService.getAllRolesForUser(userId);
    }

    /**
     * Assigns multiple roles to a user.
     *
     * @remarks Bulk-assigns roles to the specified user. Roles already assigned are silently
     * skipped. Validates that the user and all specified roles exist before persisting.
     *
     * @param userId The unique identifier of the user.
     * @param data The request body containing an array of role IDs to assign.
     * @returns An array of user-role assignment objects that are now assigned.
     * @throws {404} If the user or any of the specified roles does not exist.
     * @throws {500} If the database insertion fails.
     */
    @Post('/:userId/roles')
    @HttpCode(HttpStatus.CREATED)
    public async assignRolesToUser(
        @Param('userId') userId: string,
        @Body() data: AssignRolesToUserDto
    ): Promise<UserRoleDto[]> {
        this.logger.log(`Attempting to bulk-assign ${data.roleIds.length} role(s) to user ${userId}`);

        return await this.userRoleService.assignRolesToUser(userId, data.roleIds);
    }

    /**
     * Assigns a specific role to a user.
     *
     * @param userId The unique identifier of the user.
     * @param roleId The unique identifier of the role to assign.
     * @returns The newly created user-role assignment object.
     * @throws {404} If the user or role does not exist.
     * @throws {409} If the role is already assigned to the user.
     * @throws {500} If the database insertion fails.
     */
    @Post('/:userId/roles/:roleId')
    public async assignRoleToUser(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string
    ): Promise<UserRoleDto> {
        this.logger.log(`Attempting to assign role ${roleId} to user ${userId}`);

        return await this.userRoleService.assignRoleToUser(roleId, userId);
    }

    /**
     * Removes a specific role from a user.
     *
     * @param userId The unique nanoid of the user.
     * @param roleId The unique nanoid of the role to remove.
     * @throws {404} If the user or role does not exist, or the role is not assigned.
     * @throws {500} If the database deletion fails.
     */
    @Delete('/:userId/roles/:roleId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeRoleFromUser(@Param('userId') userId: string, @Param('roleId') roleId: string): Promise<void> {
        this.logger.log(`Attempting to remove role ${roleId} from user ${userId}`);

        await this.userRoleService.removeRoleFromUser(roleId, userId);

        this.logger.log(`Role ${roleId} successfully removed from user ${userId}`);
    }
}
