export const Permissions = {
    USER_READ: 'user:read',
    USER_CREATE: 'user:create',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    USER_PURGE: 'user:purge',
    USER_MANAGE_ROLES: 'user:manage-roles',
    ROLE_READ: 'role:read',
    ROLE_CREATE: 'role:create',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',
    ROLE_MANAGE_PERMISSIONS: 'role:manage-permissions',
    PERMISSION_READ: 'permission:read',
    PERMISSION_CREATE: 'permission:create',
    PERMISSION_UPDATE: 'permission:update',
    PERMISSION_DELETE: 'permission:delete',
    CLIENT_READ: 'client:read',
    CLIENT_CREATE: 'client:create',
    CLIENT_UPDATE: 'client:update',
    CLIENT_DELETE: 'client:delete',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
