import { User } from '@/auth-domain';
import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
     * The timestamp when the user was soft-deleted. If null, the user is considered active.
     * @example "2024-03-19T09:00:00.000Z"
     */
    @IsDate()
    public removedAt!: Date | null;
}
