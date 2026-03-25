import { UpdateUserData } from '@/user/domain';
import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PickType(UserDto, ['username']) implements UpdateUserData {}
