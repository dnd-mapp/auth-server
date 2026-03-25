import { CreateRoleData } from '@/auth-domain';
import { PickType } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class CreateRoleDto extends PickType(RoleDto, ['name']) implements CreateRoleData {}
