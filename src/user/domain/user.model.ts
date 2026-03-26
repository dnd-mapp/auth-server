import { Role } from '@/role/domain';

export interface User {
    id: string;
    username: string;
    roles: Role[];

    createdAt: Date;
    updatedAt: Date;
    removedAt: Date | null;
}

export interface CreateUserData extends Pick<User, 'username'> {
    roleIds: string[];
    password: string;
}

export type UpdateUserData = Pick<User, 'username'>;
