export interface SigningKey {
    kid: string;
    privateKey: string;
    publicKey: string;
    algorithm: string;
    createdAt: Date;
    revokedAt: Date | null;
}
