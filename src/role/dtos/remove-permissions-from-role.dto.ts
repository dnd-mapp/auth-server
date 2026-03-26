import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemovePermissionsFromRoleDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    public permissionIds!: string[];
}
