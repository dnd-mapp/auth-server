import { AppConfigurationNamespaces, SecurityConfig } from '@/common';
import { registerAs } from '@nestjs/config';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const securityConfig = registerAs<SecurityConfig>(AppConfigurationNamespaces.SECURITY, () => ({
    passwordPepper: process.env[EnvironmentVariableNames.PASSWORD_PEPPER]!,
    issuer: process.env[EnvironmentVariableNames.ISSUER]!,
    keyEncryptionSecret: process.env[EnvironmentVariableNames.KEY_ENCRYPTION_SECRET]!,
}));
