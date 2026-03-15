export const ConfigurationNamespaces = {
    SERVER: 'server',
} as const;

export type ConfigurationNamespace = (typeof ConfigurationNamespaces)[keyof typeof ConfigurationNamespaces];
