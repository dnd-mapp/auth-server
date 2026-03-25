export interface Permission {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreatePermissionData = Pick<Permission, 'name'>;

export type UpdatePermissionData = Pick<Permission, 'name'>;
