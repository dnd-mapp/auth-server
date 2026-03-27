import { RoleDto } from '@/role/dtos';
import { User } from '@/user/domain';
import { Exclude } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';

export class UserDto implements User {
    /**
     * The unique identifier for the user
     * @example '6uP8yIBni7G_SMObi1bUw'
     */
    @IsNotEmpty()
    @IsString()
    public id!: string;

    /**
     * The unique username of the account
     * @example 'DragonSlayer_88'
     */
    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    public username!: string;

    /**
     * The email address of the account
     * @example 'dragonslayer88@example.com'
     */
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public email!: string;

    @Exclude()
    public password!: string;

    /**
     * The roles currently assigned to the user.
     * @example [{ id: '6uP8yIBni7G_SMObi1bUw', name: 'Admin' }]
     */
    @ValidateNested({ each: true })
    @IsArray()
    public roles: RoleDto[] = [];

    /**
     * The timestamp when the user record was first created.
     * @example "2024-03-19T09:00:00.000Z"
     */
    @IsDate()
    public createdAt!: Date;

    /**
     * The timestamp when the user record was last modified.
     * @example "2024-03-20T14:30:00.000Z"
     */
    @IsDate()
    public updatedAt!: Date;

    /**
     * The timestamp when the user was soft-deleted. If null, the user is considered active.
     * @example "2024-03-19T09:00:00.000Z"
     */
    @IsDate()
    public removedAt!: Date | null;
}
