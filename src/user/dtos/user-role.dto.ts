import { UserRole } from '@/user/domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRoleDto implements UserRole {
    /**
     * The unique identifier of the user.
     * @example "V1StGXR8_Z5jdHi6B-myT"
     */
    @IsNotEmpty()
    @IsString()
    public userId!: string;

    /**
     * The unique identifier of the role.
     * @example "u_9X2kLp-01wQzRtY5hGj"
     */
    @IsNotEmpty()
    @IsString()
    public roleId!: string;
}
