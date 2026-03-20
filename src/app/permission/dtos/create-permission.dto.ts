import { CreatePermissionData } from '@/auth-domain';
import { PickType } from '@nestjs/swagger';
import { PermissionDto } from './permission.dto';

export class CreatePermissionDto extends PickType(PermissionDto, ['name']) implements CreatePermissionData {}
