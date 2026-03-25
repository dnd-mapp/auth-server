import { Role } from '@/auth-domain';
import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RoleDto implements Role {
    /**
     * The unique identifier for the role
     * @example '6uP8yIBni7G_SMObi1bUw'
     */
    @IsNotEmpty()
    @IsString()
    public id!: string;

    /**
     * The unique name of the role
     * @example 'Admin'
     */
    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    public name!: string;

    /**
     * The timestamp when the role was first created.
     * @example "2024-03-19T09:00:00.000Z"
     */
    @IsDate()
    public createdAt!: Date;

    /**
     * The timestamp when the role was last modified.
     * @example "2024-03-20T14:30:00.000Z"
     */
    @IsDate()
    public updatedAt!: Date;
}
