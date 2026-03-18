import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    public id!: string;

    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    public username!: string;
}
