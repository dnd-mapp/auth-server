import { AppConfig, AppConfigurationNamespaces, SecurityConfig } from '@/common';
import { Controller, Get, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyService } from './key.service';

@Controller('/.well-known')
export class KeyController {
    private readonly logger = new Logger(KeyController.name);
    private readonly keyService: KeyService;
    private readonly configService: ConfigService<AppConfig, true>;

    constructor(keyService: KeyService, configService: ConfigService<AppConfig, true>) {
        this.keyService = keyService;
        this.configService = configService;
    }

    @Get('/jwks.json')
    public async getJwks() {
        this.logger.log('Fetching JWKS');
        return this.keyService.buildJwks();
    }

    @Get('/openid-configuration')
    public getOpenIdConfiguration() {
        this.logger.log('Fetching OIDC discovery document');
        const { issuer } = this.configService.get<SecurityConfig>(AppConfigurationNamespaces.SECURITY, {
            infer: true,
        });

        return {
            issuer,
            authorization_endpoint: `${issuer}/authorize`,
            token_endpoint: `${issuer}/token`,
            jwks_uri: `${issuer}/.well-known/jwks.json`,
            userinfo_endpoint: `${issuer}/userinfo`,
            token_endpoint_auth_methods_supported: ['client_secret_basic'],
            response_types_supported: ['code'],
            grant_types_supported: ['authorization_code', 'refresh_token'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS512'],
            scopes_supported: ['openid', 'profile', 'offline_access'],
            code_challenge_methods_supported: ['S256'],
        };
    }
}
