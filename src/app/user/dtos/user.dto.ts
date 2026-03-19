import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
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
}
