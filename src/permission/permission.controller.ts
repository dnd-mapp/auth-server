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
import { CreatePermissionDto, PermissionDto, UpdatePermissionDto } from './dtos';
import { PermissionService } from './permission.service';

@Controller('/permissions')
export class PermissionController {
    private readonly logger = new Logger(PermissionController.name);
    private readonly permissionService: PermissionService;

    constructor(permissionService: PermissionService) {
        this.permissionService = permissionService;
    }

    /**
     * Retrieve a list of all permissions.
     *
     * @remarks Fetches all permission records from the database,
     * ordered alphabetically by name.
     *
     * @returns A list of permission DTOs.
     * @throws {500} If the database query fails.
     */
    @Get()
    public async getAll(): Promise<PermissionDto[]> {
        this.logger.log('Fetching all permissions');
        return await this.permissionService.getAll();
    }

    /**
     * Create a new permission.
     *
     * @remarks Registers a new permission in the system. Validates that the
     * permission name is unique before persistence.
     *
     * @param data The permission data (e.g., name).
     * @param response Fastify response object to set the Location header.
     * @returns The newly created permission record.
     * @throws {409} If the permission name is already taken.
     * @throws {500} If the database insertion fails.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() data: CreatePermissionDto,
        @Res({ passthrough: true }) response: FastifyReply
    ): Promise<PermissionDto> {
        this.logger.log(`Received request to create a new permission: "${data.name}"`);

        const created = await this.permissionService.create(data);

        response.headers({ location: `/permissions/${created.id}` });
        return created;
    }

    /**
     * Retrieve a single permission by ID.
     *
     * @remarks Finds a permission record by its unique identifier.
     *
     * @param permissionId The unique ID of the permission.
     * @returns The permission object.
     * @throws {404} If no permission is found with the provided ID.
     * @throws {500} If the database query fails.
     */
    @Get('/:permissionId')
    public async getById(@Param('permissionId') permissionId: string): Promise<PermissionDto> {
        this.logger.log(`Fetching permission with ID "${permissionId}"`);
        const byId = await this.permissionService.getById(permissionId);

        if (!byId) {
            this.logger.warn(`Permission lookup failed: ID "${permissionId}" not found`);
            throw new NotFoundException(`Permission with ID "${permissionId}" was not found`);
        }
        return byId;
    }

    /**
     * Update an existing permission.
     *
     * @remarks Modifies permission information based on the provided ID.
     * Validates that the new name is not already in use by another permission.
     *
     * @param permissionId The unique ID of the permission.
     * @param data The updated permission data (e.g., name).
     * @returns The updated permission record.
     * @throws {404} If the permission does not exist.
     * @throws {409} If the new name is already in use.
     * @throws {500} If the database update fails.
     */
    @Put('/:permissionId')
    public async updateById(
        @Param('permissionId') permissionId: string,
        @Body() data: UpdatePermissionDto
    ): Promise<PermissionDto> {
        this.logger.log(`Request to update permission with ID "${permissionId}"`);

        return await this.permissionService.update(permissionId, data);
    }

    /**
     * Delete a permission.
     *
     * @remarks Permanently removes a permission record from the database.
     *
     * @param permissionId The unique ID of the permission to remove.
     * @throws {404} If the permission does not exist.
     * @throws {500} If the database query fails.
     */
    @Delete('/:permissionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeById(@Param('permissionId') permissionId: string): Promise<void> {
        this.logger.log(`Initiating delete for permission ID "${permissionId}"`);

        await this.permissionService.removeById(permissionId);

        this.logger.log(`Permission ID "${permissionId}" successfully removed`);
    }
}
