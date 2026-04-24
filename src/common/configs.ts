import { ConfigurationNamespaces, SharedBackendConfig } from '@dnd-mapp/shared-backend';

export const AppConfigurationNamespaces = {
    ...ConfigurationNamespaces,
    SECURITY: 'security',
} as const;

export interface SecurityConfig {
    passwordPepper: string;
    issuer: string;
    keyEncryptionSecret: string;
}

export interface AppConfig extends SharedBackendConfig {
    [AppConfigurationNamespaces.SECURITY]: SecurityConfig;
}
