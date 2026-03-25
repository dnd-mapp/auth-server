import { UpdatePermissionData } from '@/permission/domain';
import { PickType } from '@nestjs/swagger';
import { PermissionDto } from './permission.dto';

export class UpdatePermissionDto extends PickType(PermissionDto, ['name']) implements UpdatePermissionData {}
