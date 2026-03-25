import { recordToRoleDto, selectedRoleAttributes } from '@/app/role/repositories';
import { Prisma } from '@/prisma/client';
import { UserDto, UserRoleDto } from '../dtos';

export const selectedUserRoleAttributes = {
    userId: true,
    roleId: true,
    role: {
        select: {
            ...selectedRoleAttributes,
        },
    },
} satisfies Prisma.UserRoleSelect;

type PrismaUserRole = Prisma.UserRoleGetPayload<{ select: typeof selectedUserRoleAttributes }>;

export const selectedUserAttributes = {
    id: true,
    username: true,
    roles: {
        select: {
            ...selectedUserRoleAttributes,
        },
    },
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
} satisfies Prisma.UserSelect;

type PrismaUser = Prisma.UserGetPayload<{ select: typeof selectedUserAttributes }>;

export function recordToUserDto(record: PrismaUser) {
    const dto = new UserDto();

    dto.id = record.id;
    dto.username = record.username;
    dto.roles = record.roles.map(({ role }) => recordToRoleDto(role));

    dto.createdAt = record.createdAt;
    dto.updatedAt = record.updatedAt;
    dto.removedAt = record.deletedAt;
    return dto;
}

export function recordsToUserDtos(records: PrismaUser[]) {
    return records.map((record) => recordToUserDto(record));
}

export function recordToUserRoleDto(record: PrismaUserRole) {
    const dto = new UserRoleDto();

    dto.roleId = record.roleId;
    dto.userId = record.userId;
    return dto;
}
