import { ConfigurationNamespaces, SecurityConfig } from '@/common';
import { registerAs } from '@nestjs/config';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const securityConfig = registerAs<SecurityConfig>(ConfigurationNamespaces.SECURITY, () => ({
    passwordPepper: process.env[EnvironmentVariableNames.PASSWORD_PEPPER]!,
}));
