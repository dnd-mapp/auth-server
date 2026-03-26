import { PermissionService } from '@/permission/permission.service';
import { isArrayEmpty } from '@dnd-mapp/shared-utils';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RolePermissionRepository } from '../repositories';
import { RoleService } from './role.service';

@Injectable()
export class RolePermissionService {
    private readonly logger = new Logger(RolePermissionService.name);
    private readonly rolePermissionRepository: RolePermissionRepository;
    private readonly roleService: RoleService;
    private readonly permissionService: PermissionService;

    constructor(
        rolePermissionRepository: RolePermissionRepository,
        roleService: RoleService,
        permissionService: PermissionService
    ) {
        this.rolePermissionRepository = rolePermissionRepository;
        this.roleService = roleService;
        this.permissionService = permissionService;
    }

    public async assignPermissionToRole(roleId: string, permissionId: string) {
        const role = await this.roleService.getById(roleId);

        if (!role) {
            this.logger.warn(`Failed to assign permission: Role with ID "${roleId}" not found`);
            throw new NotFoundException(`Role with ID "${roleId}" was not found`);
        }
        const permission = await this.permissionService.getById(permissionId);

        if (!permission) {
            this.logger.warn(`Failed to assign permission: Permission with ID "${permissionId}" not found`);
            throw new NotFoundException(`Permission with ID "${permissionId}" was not found`);
        }
        if (await this.isPermissionAssignedToRole(roleId, permissionId)) {
            this.logger.warn(`Conflict: Permission ${permissionId} is already assigned to role ${roleId}`);
            throw new ConflictException(`Role already has the permission "${permissionId}" assigned.`);
        }
        return await this.rolePermissionRepository.assignPermissionToRole(roleId, permissionId);
    }

    public async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
        const role = await this.roleService.getById(roleId);

        if (!role) {
            this.logger.warn(`Failed to bulk-assign permissions: Role with ID "${roleId}" not found`);
            throw new NotFoundException(`Role with ID "${roleId}" was not found`);
        }
        let permissions = await Promise.all(
            permissionIds.map(async (permissionId) => ({
                permissionId,
                permission: await this.permissionService.getById(permissionId),
            }))
        );

        permissions = permissions.filter(({ permission }) => permission === null);

        if (!isArrayEmpty(permissions)) {
            const missingPermission = permissions[0]!.permissionId;

            this.logger.warn(
                `Failed to bulk-assign permissions: Permission with ID "${missingPermission}" does not exist`
            );
            throw new NotFoundException(`Permission with ID "${missingPermission}" was not found`);
        }
        return await this.rolePermissionRepository.assignPermissionsToRole(roleId, permissionIds);
    }

    public async removePermissionFromRole(roleId: string, permissionId: string) {
        const role = await this.roleService.getById(roleId);

        if (!role) {
            this.logger.warn(`Failed to remove permission: Role with ID "${roleId}" not found`);
            throw new NotFoundException(`Role with ID "${roleId}" was not found`);
        }
        const permission = await this.permissionService.getById(permissionId);

        if (!permission) {
            this.logger.warn(`Failed to remove permission: Permission with ID "${permissionId}" not found`);
            throw new NotFoundException(`Permission with ID "${permissionId}" was not found`);
        }
        if (!(await this.isPermissionAssignedToRole(roleId, permissionId))) {
            this.logger.warn(`Cannot remove: Permission ${permissionId} is not assigned to role ${roleId}`);
            throw new NotFoundException(`Role does not have the permission "${permissionId}" assigned.`);
        }
        await this.rolePermissionRepository.removePermissionFromRole(roleId, permissionId);
    }

    public async removePermissionsFromRole(roleId: string, permissionIds: string[]) {
        const role = await this.roleService.getById(roleId);

        if (!role) {
            this.logger.warn(`Failed to bulk-remove permissions: Role with ID "${roleId}" not found`);
            throw new NotFoundException(`Role with ID "${roleId}" was not found`);
        }

        let permissions = await Promise.all(
            permissionIds.map(async (permissionId) => ({
                permissionId,
                permission: await this.permissionService.getById(permissionId),
            }))
        );

        permissions = permissions.filter(({ permission }) => permission === null);

        if (!isArrayEmpty(permissions)) {
            const missingPermission = permissions[0]!.permissionId;

            this.logger.warn(
                `Failed to bulk-remove permissions: Permission with ID "${missingPermission}" does not exist`
            );
            throw new NotFoundException(`Permission with ID "${missingPermission}" was not found`);
        }

        const unassigned = await Promise.all(
            permissionIds.map(async (permissionId) => ({
                permissionId,
                assigned: await this.isPermissionAssignedToRole(roleId, permissionId),
            }))
        );

        const notAssigned = unassigned.filter(({ assigned }) => !assigned);

        if (!isArrayEmpty(notAssigned)) {
            const permissionId = notAssigned[0]!.permissionId;

            this.logger.warn(`Cannot bulk-remove: Permission "${permissionId}" is not assigned to role "${roleId}"`);
            throw new NotFoundException(`Role does not have the permission "${permissionId}" assigned.`);
        }

        await this.rolePermissionRepository.removePermissionsFromRole(roleId, permissionIds);
    }

    private async getPermissionForRole(roleId: string, permissionId: string) {
        return await this.rolePermissionRepository.findPermissionForRole(roleId, permissionId);
    }

    private async isPermissionAssignedToRole(roleId: string, permissionId: string) {
        const rolePermission = await this.getPermissionForRole(roleId, permissionId);
        return Boolean(rolePermission);
    }
}
