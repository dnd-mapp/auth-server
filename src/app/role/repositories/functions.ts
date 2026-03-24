import { Prisma } from '@/prisma/client';
import { RoleDto } from '../dtos';

export const selectedRoleAttributes = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.RoleSelect;

export type PrismaRole = Prisma.RoleGetPayload<{ select: typeof selectedRoleAttributes }>;

export function recordToRoleDto(record: PrismaRole) {
    const dto = new RoleDto();

    dto.id = record.id;
    dto.name = record.name;
    dto.createdAt = record.createdAt;
    dto.updatedAt = record.updatedAt;
    return dto;
}

export function recordsToRoleDtos(records: PrismaRole[]) {
    return records.map((record) => recordToRoleDto(record));
}
