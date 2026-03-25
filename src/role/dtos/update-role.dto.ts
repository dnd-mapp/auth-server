import { UpdateRoleData } from '@/role/domain';
import { PickType } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class UpdateRoleDto extends PickType(RoleDto, ['name']) implements UpdateRoleData {}
