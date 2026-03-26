import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignRolesToUserDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    public roleIds!: string[];
}
