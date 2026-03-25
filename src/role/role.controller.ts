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
    Res,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './services';

@Controller('/roles')
export class RoleController {
    private readonly logger = new Logger(RoleController.name);
    private readonly roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
    }

    /**
     * Retrieve a list of all roles.
     *
     * @remarks Fetches all role records from the database,
     * ordered alphabetically by name.
     *
     * @returns A list of role DTOs.
     * @throws {500} If the database query fails.
     */
    @Get()
    public async getAll(): Promise<RoleDto[]> {
        this.logger.log('Fetching all roles');
        return await this.roleService.getAll();
    }

    /**
     * Create a new role.
     *
     * @remarks Registers a new role in the system. Validates that the
     * role name is unique before persistence.
     *
     * @param data The role data (e.g., name).
     * @param response Fastify response object to set the Location header.
     * @returns The newly created role record.
     * @throws {409} If the role name is already taken.
     * @throws {500} If the database insertion fails.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() data: CreateRoleDto,
        @Res({ passthrough: true }) response: FastifyReply
    ): Promise<RoleDto> {
        this.logger.log(`Received request to create a new role: "${data.name}"`);

        const created = await this.roleService.create(data);

        response.headers({ location: `/roles/${created.id}` });
        return created;
    }

    /**
     * Retrieve a single role by ID.
     *
     * @remarks Finds a role record by its unique identifier.
     *
     * @param roleId The unique ID of the role.
     * @returns The role object.
     * @throws {404} If no role is found with the provided ID.
     * @throws {500} If the database query fails.
     */
    @Get('/:roleId')
    public async getById(@Param('roleId') roleId: string): Promise<RoleDto> {
        this.logger.log(`Fetching role with ID "${roleId}"`);
        const byId = await this.roleService.getById(roleId);

        if (!byId) {
            this.logger.warn(`Role lookup failed: ID "${roleId}" not found`);
            throw new NotFoundException(`Role with ID "${roleId}" was not found`);
        }
        return byId;
    }

    /**
     * Update an existing role.
     *
     * @remarks Modifies role information based on the provided ID.
     * Validates that the new name is not already in use by another role.
     *
     * @param roleId The unique ID of the role.
     * @param data The updated role data (e.g., name).
     * @returns The updated role record.
     * @throws {404} If the role does not exist.
     * @throws {409} If the new name is already in use.
     * @throws {500} If the database update fails.
     */
    @Put('/:roleId')
    public async updateById(@Param('roleId') roleId: string, @Body() data: UpdateRoleDto): Promise<RoleDto> {
        this.logger.log(`Request to update role with ID "${roleId}"`);

        return await this.roleService.update(roleId, data);
    }

    /**
     * Delete a role.
     *
     * @remarks Permanently removes a role record from the database.
     *
     * @param roleId The unique ID of the role to remove.
     * @throws {404} If the role does not exist.
     * @throws {500} If the database query fails.
     */
    @Delete('/:roleId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeById(@Param('roleId') roleId: string): Promise<void> {
        this.logger.log(`Initiating delete for role ID "${roleId}"`);

        await this.roleService.removeById(roleId);

        this.logger.log(`Role ID "${roleId}" successfully removed`);
    }
}
