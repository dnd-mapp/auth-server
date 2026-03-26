import { RolePermission } from '@/role/domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class RolePermissionDto implements RolePermission {
    /**
     * The unique identifier of the role.
     * @example "0UfVIgpN98wqOIi_j7qxF"
     */
    @IsNotEmpty()
    @IsString()
    public roleId!: string;

    /**
     * The unique identifier of the permission.
     * @example "RuKRHK1kBWHIx5m2qwq6R"
     */
    @IsNotEmpty()
    @IsString()
    public permissionId!: string;
}
