export interface Role {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateRoleData = Pick<Role, 'name'>;

export type UpdateRoleData = Pick<Role, 'name'>;
