import { Role } from '@/role/domain';

export interface User {
    id: string;
    username: string;
    email: string;
    roles: Role[];

    createdAt: Date;
    updatedAt: Date;
    removedAt: Date | null;
}

export interface CreateUserData extends Pick<User, 'username' | 'email'> {
    roleIds: string[];
    password: string;
}

export type UpdateUserData = Pick<User, 'username'>;
