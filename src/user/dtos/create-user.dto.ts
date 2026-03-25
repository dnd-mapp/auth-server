import { CreateUserData } from '@/user/domain';
import { PickType } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends PickType(UserDto, ['username']) implements CreateUserData {
    /**
     * A list of role IDs (nanoids) to assign to the user upon creation. Must contain at least one role.
     * @example ["6uP8yIBni7G_SMObi1bUw", "sc8k1OyhsXBbv64w7Enl8"]
     */
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @ArrayMinSize(1)
    @IsArray()
    public roleIds!: string[];
}
