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
import {
    AssignPermissionsToRoleDto,
    CreateRoleDto,
    RemovePermissionsFromRoleDto,
    RoleDto,
    RolePermissionDto,
    UpdateRoleDto,
} from './dtos';
import { RolePermissionService, RoleService } from './services';

@Controller('/roles')
export class RoleController {
    private readonly logger = new Logger(RoleController.name);
    private readonly roleService: RoleService;
    private readonly rolePermissionService: RolePermissionService;

    constructor(roleService: RoleService, rolePermissionService: RolePermissionService) {
        this.roleService = roleService;
        this.rolePermissionService = rolePermissionService;
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

    /**
     * Assigns a specific permission to a role.
     *
     * @param roleId The unique identifier of the role.
     * @param permissionId The unique identifier of the permission to assign.
     * @returns The newly created role-permission assignment object.
     * @throws {404} If the role or permission does not exist.
     * @throws {409} If the permission is already assigned to the role.
     * @throws {500} If the database insertion fails.
     */
    @Post('/:roleId/permissions/:permissionId')
    @HttpCode(HttpStatus.CREATED)
    public async assignPermissionToRole(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string
    ): Promise<RolePermissionDto> {
        this.logger.log(`Attempting to assign permission ${permissionId} to role ${roleId}`);

        return await this.rolePermissionService.assignPermissionToRole(roleId, permissionId);
    }

    /**
     * Assigns multiple permissions to a role.
     *
     * @remarks Bulk-assigns permissions to the specified role. Permissions already assigned are silently
     * skipped. Validates that the role and all specified permissions exist before persisting.
     *
     * @param roleId The unique identifier of the role.
     * @param data The request body containing an array of permission IDs to assign.
     * @returns An array of role-permission assignment objects that are now assigned.
     * @throws {404} If the role or any of the specified permissions does not exist.
     * @throws {500} If the database insertion fails.
     */
    @Post('/:roleId/permissions')
    @HttpCode(HttpStatus.CREATED)
    public async assignPermissionsToRole(
        @Param('roleId') roleId: string,
        @Body() data: AssignPermissionsToRoleDto
    ): Promise<RolePermissionDto[]> {
        this.logger.log(`Attempting to bulk-assign ${data.permissionIds.length} permission(s) to role ${roleId}`);

        return await this.rolePermissionService.assignPermissionsToRole(roleId, data.permissionIds);
    }

    /**
     * Removes a specific permission from a role.
     *
     * @param roleId The unique nanoid of the role.
     * @param permissionId The unique nanoid of the permission to remove.
     * @throws {404} If the role or permission does not exist, or the permission is not assigned.
     * @throws {500} If the database deletion fails.
     */
    @Delete('/:roleId/permissions/:permissionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removePermissionFromRole(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string
    ): Promise<void> {
        this.logger.log(`Attempting to remove permission ${permissionId} from role ${roleId}`);

        await this.rolePermissionService.removePermissionFromRole(roleId, permissionId);

        this.logger.log(`Permission ${permissionId} successfully removed from role ${roleId}`);
    }

    /**
     * Removes multiple permissions from a role.
     *
     * @remarks Bulk-removes permissions from the specified role. Validates that the role
     * and all specified permissions exist, and that each permission is currently assigned to the role.
     *
     * @param roleId The unique identifier of the role.
     * @param data The request body containing an array of permission IDs to remove.
     * @throws {404} If the role, any of the specified permissions, or any permission assignment does not exist.
     * @throws {500} If the database deletion fails.
     */
    @Delete('/:roleId/permissions')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removePermissionsFromRole(
        @Param('roleId') roleId: string,
        @Body() data: RemovePermissionsFromRoleDto
    ): Promise<void> {
        this.logger.log(`Attempting to bulk-remove ${data.permissionIds.length} permission(s) from role ${roleId}`);

        await this.rolePermissionService.removePermissionsFromRole(roleId, data.permissionIds);

        this.logger.log(`Successfully removed ${data.permissionIds.length} permission(s) from role ${roleId}`);
    }
}
