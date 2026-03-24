import { Role } from '../role';

export interface User {
    id: string;
    username: string;
    roles: Role[];

    createdAt: Date;
    updatedAt: Date;
    removedAt: Date | null;
}

export interface CreateUserData extends Pick<User, 'username'> {
    roles: string[];
}

export type UpdateUserData = Pick<User, 'username'>;
