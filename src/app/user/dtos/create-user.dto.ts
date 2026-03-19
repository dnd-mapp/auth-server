import { CreateUserData } from '@/auth-domain';
import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CreateUserDto extends PickType(UserDto, ['username']) implements CreateUserData {}
