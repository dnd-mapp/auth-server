export const ConfigurationNamespaces = {
    SERVER: 'server',
    DATABASE: 'database',
} as const;

export type ConfigurationNamespace = (typeof ConfigurationNamespaces)[keyof typeof ConfigurationNamespaces];
