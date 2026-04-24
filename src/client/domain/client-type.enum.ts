export const ClientTypes = {
    PUBLIC: 'public',
    CONFIDENTIAL: 'confidential',
} as const;

export type ClientType = (typeof ClientTypes)[keyof typeof ClientTypes];
