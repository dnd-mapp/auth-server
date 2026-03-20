import { Permission } from '@/auth-domain';
import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PermissionDto implements Permission {
    /**
     * The unique identifier for the permission
     * @example '6uP8yIBni7G_SMObi1bUw'
     */
    @IsNotEmpty()
    @IsString()
    public id!: string;

    /**
     * The unique name of the permission
     * @example 'resource:write'
     */
    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    public name!: string;

    /**
     * The timestamp when the permission was first created.
     * @example "2024-03-19T09:00:00.000Z"
     */
    @IsDate()
    public createdAt!: Date;

    /**
     * The timestamp when the permission was last modified.
     * @example "2024-03-20T14:30:00.000Z"
     */
    @IsDate()
    public updatedAt!: Date;
}
