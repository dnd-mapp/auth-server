export interface User {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    removedAt: Date | null;
}

export type CreateUserData = Pick<User, 'username'>;

export type UpdateUserData = Pick<User, 'username'>;
