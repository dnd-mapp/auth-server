import { AppConfig, AppConfigurationNamespaces, SecurityConfig } from '@/common';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { exportJWK, exportPKCS8, exportSPKI, generateKeyPair, importSPKI } from 'jose';
import { SigningKey } from './domain';
import { KeyRepository } from './key.repository';

const ALGORITHM = 'RS512';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

@Injectable()
export class KeyService implements OnApplicationBootstrap {
    private readonly logger = new Logger(KeyService.name);
    private readonly keyRepository: KeyRepository;
    private readonly configService: ConfigService<AppConfig, true>;

    constructor(keyRepository: KeyRepository, configService: ConfigService<AppConfig, true>) {
        this.keyRepository = keyRepository;
        this.configService = configService;
    }

    public async onApplicationBootstrap(): Promise<void> {
        const active = await this.keyRepository.findActive();

        if (!active) {
            this.logger.log('No active signing key found — generating a new key pair');
            await this.generateAndPersist();
        }
    }

    public async generateAndPersist(): Promise<SigningKey> {
        const { privateKey, publicKey } = await generateKeyPair(ALGORITHM, { extractable: true });
        const privateKeyPem = await exportPKCS8(privateKey);
        const publicKeyPem = await exportSPKI(publicKey);
        const encryptedPrivateKey = this.encryptPrivateKey(privateKeyPem);

        return this.keyRepository.create({ privateKey: encryptedPrivateKey, publicKey: publicKeyPem });
    }

    public async getActiveSigningKey(): Promise<{ kid: string; privateKeyPem: string }> {
        const key = await this.keyRepository.findActive();

        if (!key) {
            throw new Error('No active signing key available');
        }
        return { kid: key.kid, privateKeyPem: this.decryptPrivateKey(key.privateKey) };
    }

    public async getActivePublicKeys(): Promise<SigningKey[]> {
        return this.keyRepository.findAllActive();
    }

    public async buildJwks(): Promise<{ keys: object[] }> {
        const keys = await this.getActivePublicKeys();
        const jwkEntries = await Promise.all(
            keys.map(async (key) => {
                const publicKey = await importSPKI(key.publicKey, ALGORITHM);
                const jwk = await exportJWK(publicKey);
                return { ...jwk, kid: key.kid, alg: ALGORITHM };
            })
        );
        return { keys: jwkEntries };
    }

    private encryptPrivateKey(pem: string): string {
        const secret = this.getEncryptionSecret();
        const iv = randomBytes(12);
        const cipher = createCipheriv(ENCRYPTION_ALGORITHM, secret, iv);
        const encrypted = Buffer.concat([cipher.update(pem, 'utf-8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
    }

    private decryptPrivateKey(encrypted: string): string {
        const secret = this.getEncryptionSecret();

        const [ivHex, authTagHex, ciphertextHex] = encrypted.split(':');
        const iv = Buffer.from(ivHex!, 'hex');
        const authTag = Buffer.from(authTagHex!, 'hex');
        const ciphertext = Buffer.from(ciphertextHex!, 'hex');

        const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, secret, iv);

        decipher.setAuthTag(authTag);

        return decipher.update(ciphertext).toString('utf-8') + decipher.final('utf-8');
    }

    private getEncryptionSecret(): Buffer {
        const config: SecurityConfig = this.configService.get(AppConfigurationNamespaces.SECURITY, { infer: true });
        return Buffer.from(config.keyEncryptionSecret.padEnd(32, '0').slice(0, 32));
    }
}
